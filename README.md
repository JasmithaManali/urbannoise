# Urban Noise Classification MVP

A comprehensive web application for monitoring and analyzing urban noise patterns using machine learning and interactive mapping.

## Features

### Core Functionality
- **Interactive Google Maps Heatmap**: Real-time visualization of noise levels with customizable time-range filtering
- **Audio Capture Widget**: Records 3-10 second audio samples with real-time RMS dB monitoring
- **Machine Learning Integration**: Automatic noise classification with confidence scores
- **Route Planning**: Find quiet route alternatives using Google Directions API
- **Privacy-First Design**: Explicit consent management for microphone and location access

### User Interface
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Modern UI**: Clean, professional interface with smooth animations and micro-interactions
- **Interactive Map**: Click on data points to view detailed noise information
- **Real-time Feedback**: Live audio level monitoring during recording

### Administrative Tools
- **API Configuration**: Easy setup for backend API endpoints
- **Connection Testing**: Verify API connectivity and authentication
- **Data Management**: View recent noise recordings and system status
- **Privacy Controls**: Manage user consent preferences and data storage options

## Required API Keys

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - Maps JavaScript API
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Directions API
   - Geocoding API
4. Create credentials (API Key)
5. Replace `AIzaSyDemo_Key_Replace_With_Real_Key` in `src/components/MapComponent.tsx`

### Backend API Configuration
Configure your backend API in the Admin panel with:
- **Base URL**: Your API server endpoint
- **API Key**: Authentication token for your backend

## Required Backend Endpoints

### GET /heatmapData
Returns noise data points for map visualization.

**Query Parameters:**
- `timeRange`: Filter data by time period (`1h`, `24h`, `7d`)

**Response Format:**
```json
[
  {
    "id": "string",
    "lat": number,
    "lng": number,
    "timestamp": "ISO 8601 string",
    "label": "Traffic|Construction|Music|Quiet",
    "noise_level": number,
    "confidence": number,
    "audio_url": "string (optional)"
  }
]
```

### POST /upload
Processes audio recordings and returns ML classification results.

**Request Body:**
```json
{
  "audio": "base64 encoded audio data",
  "lat": number,
  "lng": number,
  "store_audio": boolean
}
```

**Response Format:**
```json
{
  "id": "string",
  "label": "string",
  "confidence": number,
  "noise_level": number,
  "message": "string"
}
```

### GET /route
Returns optimal route information including quiet alternatives.

**Query Parameters:**
- `start`: Starting location (address or coordinates)
- `end`: Destination location (address or coordinates)
- `quiet`: Boolean flag for quiet route alternative

**Response Format:**
```json
{
  "coordinates": [
    { "lat": number, "lng": number }
  ],
  "distance": "string",
  "duration": "string",
  "isQuiet": boolean
}
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Google Maps API key
- Backend API server

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Replace the Google Maps API key in `src/components/MapComponent.tsx`
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:5173 in your browser

### Production Build
```bash
npm run build
npm run preview
```

## Privacy & Data Protection

### User Consent Management
- Explicit consent required for microphone and location access
- Optional audio storage with clear opt-out mechanism
- Consent preferences stored locally and respected across sessions

### Data Collection
- **Microphone**: Required for audio recording and noise analysis
- **Location**: Required for geographical mapping of noise data
- **Audio Storage**: Optional, users can opt-out while still using the service

## Demo Account

The application includes a demo mode with mock data for testing:

- **API Base URL**: `https://api.urbannoise.demo`
- **API Key**: `demo-key-12345`
- **Sample Data**: Pre-loaded noise data points around New York City

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

**Note**: Microphone access requires HTTPS in production environments.

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Mapping**: Google Maps JavaScript API with Visualization Library
- **Audio Processing**: Web Audio API, MediaRecorder API
- **Routing**: React Router
- **State Management**: React Context API
- **Build Tool**: Vite

## License

MIT License - see LICENSE file for details.