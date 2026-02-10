import os
import librosa
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from tqdm import tqdm  # pip install tqdm

# --- CONFIGURATION ---
# POINT THIS TO YOUR DATASET FOLDER
# Structure should be: dataset_folder/class_name/file.wav
DATASET_PATH = "UrbanSound8K/audio/" 

# --- SAME FEATURE EXTRACTOR AS LAMBDA ---
def extract_42_features(file_path):
    try:
        y, sr = librosa.load(file_path, duration=5)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20).mean(axis=1)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr).mean(axis=1)
        contrast = librosa.feature.spectral_contrast(y=y, sr=sr).mean(axis=1)
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        rmse = np.mean(librosa.feature.rms(y=y))
        rolloff = np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr))
        return np.hstack([mfcc, chroma, contrast, zcr, rmse, rolloff])
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

# --- TRAINING LOOP ---
print("🚀 Starting Training...")
features = []
labels = []

# Walk through all folders
for label in os.listdir(DATASET_PATH):
    class_dir = os.path.join(DATASET_PATH, label)
    if os.path.isdir(class_dir):
        print(f"📂 Processing class: {label}")
        for filename in tqdm(os.listdir(class_dir)):
            if filename.endswith(('.wav', '.mp3')):
                path = os.path.join(class_dir, filename)
                data = extract_42_features(path)
                if data is not None:
                    features.append(data)
                    labels.append(label)

X = np.array(features)
y = np.array(labels)

print(f"📊 Extracted {X.shape[0]} samples with {X.shape[1]} features each.")

# --- CRITICAL STEP: SCALE THE DATA ---
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Encode Labels (Drilling -> 3)
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train Model
print("🧠 Training Random Forest...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_scaled, y_encoded)

# --- SAVE EVERYTHING ---
print("💾 Saving Model + Scaler + Labels...")
joblib.dump({
    'model': model,
    'scaler': scaler,       # <--- THE MISSING PIECE
    'label_encoder': le
}, 'urban_noise_classifier.joblib')

print("✅ DONE! Upload 'urban_noise_classifier.joblib' to S3 now.")