import json
import boto3
import joblib
import os
import time
import librosa
import numpy as np
import base64
import email
import subprocess
from email import policy

def lambda_handler(event, context):
    report = {}
    try:
        # --- CHECK 1: IS FFMPEG INSTALLED? ---
        try:
            ffmpeg_version = subprocess.check_output(['ffmpeg', '-version'], stderr=subprocess.STDOUT).decode()
            report['1_system_ffmpeg'] = "INSTALLED: " + ffmpeg_version.split('\n')[0]
        except Exception as e:
            report['1_system_ffmpeg'] = f"MISSING (CRITICAL ERROR): {str(e)}"

        # --- CHECK 2: SAVE FILE TO DISK ---
        body_content = event.get('body')
        if event.get('isBase64Encoded', False):
            body_content = base64.b64decode(body_content)
        else:
            body_content = body_content.encode('utf-8')

        headers = {k.lower(): v for k, v in event.get('headers', {}).items()}
        msg = email.message_from_bytes(f'Content-Type: {headers.get("content-type")}\r\n\r\n'.encode() + body_content, policy=policy.default)
        
        mp3_path = "/tmp/upload.mp3"
        file_saved = False
        if msg.is_multipart():
            for part in msg.iter_parts():
                if part.get_param('name', header='content-disposition') == 'audio':
                    with open(mp3_path, 'wb') as f:
                        f.write(part.get_payload(decode=True))
                    file_saved = True
        
        if not file_saved:
            return {'statusCode': 400, 'body': json.dumps({'error': 'No file saved'})}

        report['2_file_size_bytes'] = os.path.getsize(mp3_path)

        # --- CHECK 3: CAN LIBROSA HEAR IT? ---
        try:
            # Try loading with 44.1kHz (Your Training Standard)
            y, sr = librosa.load(mp3_path, sr=44100, duration=5)
            report['3_audio_load_status'] = "SUCCESS"
            report['3_audio_sample_rate'] = sr
            report['3_audio_shape'] = str(y.shape)
            report['3_audio_max_amplitude'] = str(np.max(np.abs(y)))  # Should be > 0.1
            report['3_audio_is_silent'] = "YES" if np.max(np.abs(y)) < 0.001 else "NO"
        except Exception as e:
            report['3_audio_load_status'] = f"FAILED: {str(e)}"
            return {'statusCode': 200, 'body': json.dumps(report)} # Stop here if load fails

        # --- CHECK 4: EXTRACT FEATURES ---
        # Using standard extraction
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20).mean(axis=1)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr).mean(axis=1)
        contrast = librosa.feature.spectral_contrast(y=y, sr=sr).mean(axis=1)
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        rmse = np.mean(librosa.feature.rms(y=y))
        rolloff = np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr))
        features = np.hstack([mfcc, chroma, contrast, zcr, rmse, rolloff])

        report['4_features_shape'] = str(features.shape) # Should be (42,)
        report['4_features_raw_sample'] = str(features[:5]) # Show first 5 numbers

        # --- CHECK 5: SCALER & MODEL ---
        s3_client = boto3.client('s3')
        if not os.path.exists('/tmp/model.joblib'):
            s3_client.download_file('noise-map-models', 'urban_noise_classifier.joblib', '/tmp/model.joblib')
        
        data = joblib.load('/tmp/model.joblib')
        scaler = data.get('scaler') if isinstance(data, dict) else None
        model = data.get('model') if isinstance(data, dict) else data

        if scaler:
            features_scaled = scaler.transform([features])
            report['5_scaler_status'] = "APPLIED"
            report['5_features_scaled_sample'] = str(features_scaled[0][:5]) # Should be small (e.g., -1.2, 0.5)
            prediction = model.predict(features_scaled)[0]
        else:
            report['5_scaler_status'] = "MISSING"
            prediction = model.predict([features])[0]

        report['6_raw_prediction'] = str(prediction)

        return {
            'statusCode': 200, 
            'body': json.dumps(report, indent=4)
        }
        
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({'CRITICAL_ERROR': str(e), 'report_so_far': report})}