// src/services/api.ts
import axios from 'axios';
import { NoiseData, RouteData, UploadResponse, ApiConfig } from '../types';

class ApiService {
  private config: ApiConfig = { baseUrl: '', apiKey: '' };

  setConfig(config: ApiConfig) {
    this.config = config;
  }

  // --- REAL HEATMAP FUNCTION ---
  async getHeatmapData(timeRange: string = '24h'): Promise<NoiseData[]> {
    if (!this.config.baseUrl) throw new Error('API Base URL is not configured.');

    try {
      // We will call the new /heatmap endpoint on our server
      const url = `${this.config.baseUrl}/heatmap`;
      console.log('Fetching heatmap data from:', url);
      
      const response = await axios.get(url);
      
      // The response.data will be a JSON string, so we parse it.
      // This is because our Flask app uses json.dumps()
      return JSON.parse(response.data);

    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
      throw error;
    }
  }

  // --- REAL UPLOAD FUNCTION ---
  async uploadAudio(audioBlob: Blob, location: { lat: number; lng: number }): Promise<UploadResponse> {
    if (!this.config.baseUrl) throw new Error('API Base URL is not configured.');
    
    try {
      // 1. Create a FormData object to send the file
      const formData = new FormData();
      
      // 2. Add the audio file. The key 'audio' MUST match your Flask app.py
      formData.append('audio', audioBlob, 'recording.wav');
      
      // 3. Add the location data. These keys MUST match your Flask app.py
      formData.append('latitude', String(location.lat));
      formData.append('longitude', String(location.lng));

      // 4. Send the request to the /predict endpoint
      const url = `${this.config.baseUrl}/predict`;
      console.log('Uploading audio to:', url);
      
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // 5. Return the JSON data (e.g., { predicted_class: "drilling" })
      return response.data;

    } catch (error) {
      console.error('Failed to upload audio:', error);
      throw error;
    }
  }

  // --- (Keeping mock route for now) ---
  async getRoute(start: string, end: string, quiet: boolean = false): Promise<RouteData> {
    console.warn("getRoute is still using mock data.");
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockRoute: RouteData = {
            coordinates: [
              { lat: 40.7128, lng: -74.0060 },
              { lat: 40.7589, lng: -73.9851 },
            ],
            distance: quiet ? '2.8 km' : '2.3 km',
            duration: quiet ? '12 min' : '8 min',
            isQuiet: quiet
          };
          resolve(mockRoute);
        }, 500);
      });
    } catch (error) {
      console.error('Failed to get route:', error);
      throw error;
    }
  }

  // --- (Keeping mock test for now) ---
  async testConnection(): Promise<boolean> {
    // You could replace this with a real call to a /health endpoint
    console.warn("testConnection is still using mock data.");
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
  }
}

export const apiService = new ApiService();