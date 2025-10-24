from flask import Flask, request, jsonify
import joblib
import librosa
import numpy as np
import io

app = Flask(__name__)

# --- Load Model and Encoder ---
print("Loading model...")
artifacts = joblib.load('urban_noise_classifier.joblib')
model = artifacts['model']
le = artifacts['label_encoder']
print("✅ Model loaded.")

# --- Feature Extraction Function ---
def extract_features(audio_data, sample_rate):
    try:
        mfccs = np.mean(librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=40).T, axis=0)
        spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio_data, sr=sample_rate)[0])
        zero_crossing_rate = np.mean(librosa.feature.zero_crossing_rate(y=audio_data)[0])
        return np.hstack((mfccs, spectral_centroid, zero_crossing_rate))
    except Exception as e:
        print(f"Feature extraction error: {e}")
        return None

# --- Define the /predict endpoint ---
@app.route("/predict", methods=['POST'])
def predict():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    try:
        # 1. Load audio from the request
        audio_file = request.files['audio']
        audio_bytes = audio_file.read()
        audio_data, sr = librosa.load(io.BytesIO(audio_bytes), duration=3, sr=22050*2)

        # 2. Get location (if provided)
        # You would send this as form data from React
        lat = request.form.get('latitude', 'unknown')
        lng = request.form.get('longitude', 'unknown')

        # 3. Extract features and predict
        features = extract_features(audio_data, sr)
        prediction_encoded = model.predict(features.reshape(1, -1))
        prediction_label = le.inverse_transform(prediction_encoded)[0]

        # 4. Save to DynamoDB (Here you would add your Boto3 code)
        # ...

        # 5. Return the result
        return jsonify({
            "predicted_class": prediction_label,
            "location_received": f"{lat}, {lng}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Run the app ---
if __name__ == "__main__":
    # Host='0.0.0.0' makes it accessible from the internet
    app.run(host='0.0.0.0', port=5000)