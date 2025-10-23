export interface NoiseData {
  id: string;
  lat: number;
  lng: number;
  timestamp: string;
  label: string;
  noise_level: number;
  confidence: number;
  audio_url?: string;
}

export interface RouteData {
  coordinates: { lat: number; lng: number }[];
  distance: string;
  duration: string;
  isQuiet?: boolean;
}

export interface UploadResponse {
  id: string;
  label: string;
  confidence: number;
  noise_level: number;
  message: string;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}