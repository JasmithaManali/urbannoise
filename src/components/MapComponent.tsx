import React, { useEffect, useRef, useState } from 'react';
// First install the package with: npm install @googlemaps/js-api-loader
// First install the package: npm install --save @googlemaps/js-api-loader @types/google.maps
import { Clock, Volume2, MapPin, Play } from 'lucide-react';
import { NoiseData } from '../types';
import { apiService } from '../services/api';
import { useApi } from '../contexts/ApiContext';
import './MapStyles.css';

// Declare global Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [noiseData, setNoiseData] = useState<NoiseData[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<NoiseData | null>(null);
  const [showRouting, setShowRouting] = useState(false);
  const [routeStart, setRouteStart] = useState('');
  const [routeEnd, setRouteEnd] = useState('');
  const [showQuietRoute, setShowQuietRoute] = useState(false);

  const { config } = useApi();

  useEffect(() => {
    apiService.setConfig(config);
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      loadGoogleMaps();
    } else {
      // If not loaded yet, wait for it to load
      const checkGoogleMapsLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMapsLoaded);
          loadGoogleMaps();
        }
      }, 100);
      
      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => clearInterval(checkGoogleMapsLoaded), 10000);
    }
  }, [config]);

  useEffect(() => {
    loadNoiseData();
  }, [timeRange]);

  const loadGoogleMaps = () => {
    try {
      if (mapRef.current && window.google) {
        console.log("Map container found, initializing map");
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 }, // NYC default
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });
        
        console.log("Map initialized successfully");
        setIsLoading(false);
        
        // Load data after map is initialized
        loadNoiseData();
      } else {
        console.error("Map container not found or Google Maps not loaded");
        setTimeout(loadGoogleMaps, 500); // Retry if Google Maps isn't loaded yet
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      setIsLoading(false);
    }
  };

  const loadNoiseData = async () => {
    try {
      if (!googleMapRef.current || !window.google) {
        console.log("Map not initialized yet, will try again later");
        return;
      }
      const data = await apiService.getHeatmapData(timeRange);
      setNoiseData(data);
      updateHeatmap(data);
      updateMarkers(data);
      console.log("Map data loaded successfully");
    } catch (error) {
      console.error('Error loading noise data:', error);
    }
  };

  const updateHeatmap = (data: NoiseData[]) => {
    if (!googleMapRef.current || !window.google) {
      console.log("Map not initialized yet, cannot update heatmap");
      return;
    }

    // Remove existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    console.log("Creating heatmap with", data.length, "data points");

    // Create heatmap data
    const heatmapData = data.map(point => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      weight: point.noise_level / 100 // Normalize to 0-1
    }));

    // Create new heatmap
    heatmapRef.current = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: googleMapRef.current,
      gradient: [
        'rgba(0, 255, 0, 0)',
        'rgba(0, 255, 0, 1)',
        'rgba(255, 255, 0, 1)',
        'rgba(255, 165, 0, 1)',
        'rgba(255, 0, 0, 1)'
      ],
      opacity: 0.8,
      radius: 50
    });
    
    console.log("Heatmap updated successfully");
  };

  const updateMarkers = (data: NoiseData[]) => {
    if (!googleMapRef.current || !window.google) {
      console.log("Map not initialized yet, cannot update markers");
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    console.log("Creating markers for", data.length, "data points");

    // Create new markers
    data.forEach(point => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: googleMapRef.current,
        title: `${point.label} - ${point.noise_level.toFixed(1)} dB`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getNoiseColor(point.noise_level),
          fillOpacity: 0.8,
          strokeColor: 'white',
          strokeWeight: 2
        }
      });

      marker.addListener('click', () => {
        setSelectedPoint(point);
      });

      markersRef.current.push(marker);
    });
    
    console.log("Markers updated successfully");
  };

  const getNoiseColor = (level: number) => {
    if (level < 50) return '#10B981'; // Green
    if (level < 60) return '#F59E0B'; // Yellow
    if (level < 70) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getNoiseLabel = (level: number) => {
    if (level < 50) return 'Quiet';
    if (level < 60) return 'Moderate';
    if (level < 70) return 'Noisy';
    return 'Very Loud';
  };

  const handleRouteSearch = async () => {
    if (!routeStart || !routeEnd) return;

    try {
      // This would use Google Directions API in production
      console.log('Searching route from', routeStart, 'to', routeEnd, 'quiet:', showQuietRoute);
    } catch (error) {
      console.error('Route search error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Map Controls */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Time Range Filter */}
          <div className="flex items-center space-x-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select time range"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          {/* Route Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRouting(!showRouting)}
              className={`px-4 py-2 rounded-md transition-colors ${
                showRouting 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Route Planning
            </button>
          </div>
        </div>

        {/* Route Planning Controls */}
        {showRouting && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Starting location"
                value={routeStart}
                onChange={(e) => setRouteStart(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Destination"
                value={routeEnd}
                onChange={(e) => setRouteEnd(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showQuietRoute}
                  onChange={(e) => setShowQuietRoute(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Show Quiet Route Alternative</span>
              </label>
              <button
                onClick={handleRouteSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Find Route
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
        <div className="relative">
          <div 
            ref={mapRef} 
            className="map-container"
          />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Noise Levels</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Quiet (&lt;50 dB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-700">Moderate (50-60 dB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-700">Noisy (60-70 dB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700">Very Loud (&gt;70 dB)</span>
            </div>
          </div>
        </div>

        {/* Data Count */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{noiseData.length} data points</span>
          </div>
        </div>
      </div>

      {/* Selected Point Info */}
      {selectedPoint && (
        <div className="p-4 border-t bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">Selected Location</h4>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Sound Type</div>
              <div className="font-medium">{selectedPoint.label}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Noise Level</div>
              <div className={`font-medium ${getNoiseColor(selectedPoint.noise_level) === '#10B981' ? 'text-green-600' : 
                getNoiseColor(selectedPoint.noise_level) === '#F59E0B' ? 'text-yellow-600' : 
                getNoiseColor(selectedPoint.noise_level) === '#F97316' ? 'text-orange-600' : 'text-red-600'}`}>
                {selectedPoint.noise_level.toFixed(1)} dB
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Recorded</div>
              <div className="font-medium">
                {new Date(selectedPoint.timestamp).toLocaleString()}
              </div>
            </div>
            {selectedPoint.audio_url && (
              <div>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Play Audio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;