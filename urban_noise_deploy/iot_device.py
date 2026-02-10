import boto3
import requests
import time

FILE_NAME = "hammer-drill-381906.mp3"
BUCKET_NAME = "noise-map-models"

# 🔴 CORRECT URL from your screenshot
API_URL = "https://yuihw1hxc7.execute-api.eu-north-1.amazonaws.com/default/v1"

def simulate_sensor():
    print(f"📡 DEVICE: Processing {FILE_NAME}...")
    
    # 1. Upload
    s3 = boto3.client('s3')
    try:
        s3.upload_file(FILE_NAME, BUCKET_NAME, FILE_NAME)
        print("✅ Upload: Success")
    except Exception as e:
        print(f"❌ Upload Error: {e}")
        return

    # 2. Trigger
    payload = {
        "mp3_key": FILE_NAME,
        "device_id": "Raw_Output_Test",
        "gps_lat": 12.9716,
        "gps_long": 80.2509,
        "timestamp": time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    print(f"🧠 Triggering Lambda at: {API_URL}")
    response = requests.post(API_URL, json=payload)
    
    # 3. Output
    if response.status_code == 200:
        data = response.json()
        print(f"\n🎉 RAW PREDICTION: {data.get('result')}")
        print("💾 Raw numeric class saved to DynamoDB.")
    else:
        print(f"\n❌ API Error: {response.status_code}")
        print(f"   Message: {response.text}")

if __name__ == "__main__":
    simulate_sensor()