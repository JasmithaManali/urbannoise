<h1 align="center">🌆 Urban Noise Intelligence Ecosystem</h1>

<p align="center">
  <em>AI-Driven Urban Noise Classification & Mapping System</em>
</p>

<p align="center">
  <b>Patent Pending</b> • <b>Real-Time Heatmaps</b> • <b>IoT Edge Intelligence</b>
</p>
<img width="1408" height="736" alt="Gemini_Generated_Image_rnls7frnls7frnls" src="https://github.com/user-attachments/assets/45ec30ac-a4f2-4a10-9cb2-e42c91115994" />
<img width="2816" height="1536" alt="Gemini_Generated_Image_7ws1na7ws1na7ws1-6" src="https://github.com/user-attachments/assets/e41f770f-611f-4a22-956a-fef664f82d80" />
<img width="1152" height="548" alt="Screenshot 2026-02-10 at 7 46 43 PM" src="https://github.com/user-attachments/assets/0da95334-aec1-4035-b735-132754ca5803" />

<div align="center">
  <img src="https://img.shields.io/badge/Status-Patent_Under_Review-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React_v18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Cloud-AWS_Serverless-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" />
  <img src="https://img.shields.io/badge/IoT-Edge_Computing-FCC624?style=for-the-badge&logo=linux&logoColor=black" />
  

</div>

---

### 📖 Overview
**Urban Noise Intelligence** is a comprehensive IoT and AI ecosystem designed to monitor, classify, and visualize urban noise pollution in real-time. Unlike simple decibel meters, this system uses **Machine Learning** to identify *sources* of noise (e.g., Construction, Traffic, Sirens, Public Gatherings) and map them dynamically.

This repository hosts the **Central Command Dashboard**, a high-performance React application that serves as the "Digital Twin" for the city's noise profile. It connects to our AWS cloud infrastructure via secure API Endpoints to render live heatmaps and analytics.

---
<img width="1024" height="1024" alt="Cloud API Gateway" src="https://github.com/user-attachments/assets/7cde97c8-adc2-400c-8216-de2ba446a53a" />


### 💻 The Dashboard (Front-End Core)
The heart of this repository is the **React.js Application** designed for city planners and authorities.

#### Key Features:
* **🗺️ Live Noise Heatmaps:** Integrates **Leaflet/Mapbox** to visualize noise intensity overlays on city maps in real-time.
* **📊 Dynamic Data Visualization:** Renders live decibel streams and frequency analysis using **Chart.js** and **D3.js**.
* **🔌 API-Driven Architecture:** Fetches aggregated data from **AWS API Gateway** endpoints, ensuring the frontend remains lightweight and decoupled from raw IoT streams.
* **Alert System:** Visual notifications when specific zones exceed legal noise thresholds or when anomalous patterns (e.g., gunshots/crashes) are detected.

---

### ⚙️ The Full Ecosystem: From Edge to Cloud
While this repo focuses on the frontend, the complete patented ecosystem operates on a 3-stage pipeline:

#### 1. Edge Data Collection (IoT Layer)
* **Device:** Raspberry Pi-based Edge Nodes equipped with high-fidelity microphone arrays.
* **Edge Processing:** Runs lightweight **TFLite models** locally to filter background noise and detect "events" before transmission.
* **Telemetry:** Sends processed metadata (Timestamp, GPS, dB Level, Classification Label) to the cloud via MQTT/HTTPS.

#### 2. Cloud Aggregation (AWS)
* **Ingestion:** **AWS IoT Core** receives raw streams from thousands of sensors.
* **Processing:** **AWS Lambda** functions pool the data, validating and categorizing it into regional clusters.
* **Storage:** Structured data is stored in **DynamoDB** for hot retrieval (live dashboard) and **S3** for cold storage (historical analysis).

#### 3. Prediction & Delivery (API Layer)
* **Analysis:** Cloud-based ML models refine classifications and predict noise trends based on historical patterns.
* **Delivery:** **Amazon API Gateway** exposes secure REST endpoints (e.g., `GET /noise/heatmap`, `GET /alerts/live`) which this React application consumes.

---

### 🏗️ System Architecture

> **[End Point Data Collection]** ➔ **[AWS Cloud Pooling & Categorization]** ➔ **[API Driven Endpoints]** ➔ **[React Heatmap Dashboard]**

---

### 💻 Tech Stack

<div align="center">
  <h4>Frontend (This Repo)</h4>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <br />

  <h4>Cloud & API</h4>
  <img src="https://img.shields.io/badge/AWS_API_Gateway-FF4F8B?style=for-the-badge&logo=amazon-aws&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white" />
  <img src="https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white" />
  <br />

  <h4>IoT & Edge AI</h4>
  <img src="https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=Raspberry%20Pi&logoColor=white" />
  <img src="https://img.shields.io/badge/TensorFlow_Lite-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
  <img src="https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white" />
</div>

---

### 🛠️ Getting Started (Frontend)

To run the **Urban Noise Dashboard** locally:

```bash
# Clone the repository
git clone [https://github.com/Sukheshkanna13/Urban-Noise-Intelligence.git](https://github.com/Sukheshkanna13/Urban-Noise-Intelligence.git)

# Navigate to the dashboard directory
cd client-dashboard

# Install dependencies
npm install

# Configure API Endpoint
# Create a .env file and add your AWS API Gateway URL
# REACT_APP_API_URL=[https://your-api-id.execute-api.region.amazonaws.com/prod](https://your-api-id.execute-api.region.amazonaws.com/prod)

# Run the application
npm start
