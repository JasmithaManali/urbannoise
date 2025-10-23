import axios from 'axios';
import { NoiseData, RouteData, UploadResponse, ApiConfig } from '../types';

class ApiService {
  private config: ApiConfig = { baseUrl: '', apiKey: '' };

  setConfig(config: ApiConfig) {
    this.config = config;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  // Mock data for development
  private mockNoiseData: NoiseData[] = [
    {
      id: '1',
      lat: 40.7128,
      lng: -74.0060,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      label: 'Traffic',
      noise_level: 75.5,
      confidence: 0.89,
      audio_url: 'https://example.com/audio1.mp3'
    },
    {
      id: '2',
      lat: 40.7589,
      lng: -73.9851,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      label: 'Construction',
      noise_level: 82.3,
      confidence: 0.92,
      audio_url: 'https://example.com/audio2.mp3'
    },
    {
      id: '3',
      lat: 40.7505,
      lng: -73.9934,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      label: 'Quiet',
      noise_level: 45.8,
      confidence: 0.76
    },
    {
      id: '4',
      lat: 40.7282,
      lng: -73.9942,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      label: 'Music',
      noise_level: 68.2,
      confidence: 0.84
    },
    // Additional sample data points for better heatmap visualization
    {
      id: '5',
      lat: 40.7328,
      lng: -74.0060,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      label: 'Traffic',
      noise_level: 72.1,
      confidence: 0.88
    },
    {
      id: '6',
      lat: 40.7489,
      lng: -73.9851,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      label: 'Construction',
      noise_level: 79.5,
      confidence: 0.91
    },
    {
      id: '7',
      lat: 40.7405,
      lng: -73.9834,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      label: 'Quiet',
      noise_level: 48.2,
      confidence: 0.79
    },
    {
      id: '8',
      lat: 40.7182,
      lng: -73.9842,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      label: 'Music',
      noise_level: 65.7,
      confidence: 0.82
    },
    {
      id: '9',
      lat: 40.7228,
      lng: -74.0160,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      label: 'Traffic',
      noise_level: 77.3,
      confidence: 0.87
    },
    {
      id: '10',
      lat: 40.7389,
      lng: -73.9951,
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      label: 'Construction',
      noise_level: 81.0,
      confidence: 0.90
    }
  ];

  async getHeatmapData(timeRange: string = '24h'): Promise<NoiseData[]> {
    try {
      // Mock API call - replace with actual API
      return new Promise((resolve) => {
        setTimeout(() => {
          const now = new Date();
          const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 1;
          const cutoff = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
          
          const filtered = this.mockNoiseData.filter(
            item => new Date(item.timestamp) >= cutoff
          );
          resolve(filtered);
        }, 500);
      });
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
      throw error;
    }
  }

  async uploadAudio(audioBlob: Blob, location: { lat: number; lng: number }): Promise<UploadResponse> {
    try {
      // Convert blob to base64 for mock
      const base64Audio = await this.blobToBase64(audioBlob);
      
      // Mock API response - replace with actual API
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockResponse: UploadResponse = {
            id: Date.now().toString(),
            label: ['Traffic', 'Construction', 'Music', 'Quiet'][Math.floor(Math.random() * 4)],
            confidence: 0.7 + Math.random() * 0.25,
            noise_level: 40 + Math.random() * 40,
            message: 'Audio processed successfully'
          };
          
          // Add to mock data
          const newData: NoiseData = {
            id: mockResponse.id,
            lat: location.lat,
            lng: location.lng,
            timestamp: new Date().toISOString(),
            label: mockResponse.label,
            noise_level: mockResponse.noise_level,
            confidence: mockResponse.confidence
          };
          this.mockNoiseData.unshift(newData);
          
          resolve(mockResponse);
        }, 2000);
      });
    } catch (error) {
      console.error('Failed to upload audio:', error);
      throw error;
    }
  }

  async getRoute(start: string, end: string, quiet: boolean = false): Promise<RouteData> {
    try {
      // Mock route data - replace with actual API
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockRoute: RouteData = {
            coordinates: [
              { lat: 40.7128, lng: -74.0060 },
              { lat: 40.7589, lng: -73.9851 },
              { lat: 40.7505, lng: -73.9934 }
            ],
            distance: quiet ? '2.8 km' : '2.3 km',
            duration: quiet ? '12 min' : '8 min',
            isQuiet: quiet
          };
          resolve(mockRoute);
        }, 1000);
      });
    } catch (error) {
      console.error('Failed to get route:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Mock connection test
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
      });
    } catch (error) {
      return false;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const apiService = new ApiService();