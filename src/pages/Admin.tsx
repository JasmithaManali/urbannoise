import React, { useState, useEffect } from 'react';
import { Settings, TestTube, Database, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useApi } from '../contexts/ApiContext';
import { apiService } from '../services/api';
import { NoiseData } from '../types';

const Admin: React.FC = () => {
  const { config, updateConfig, isConfigured } = useApi();
  const [formData, setFormData] = useState(config);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | null>(null);
  const [recentRecords, setRecentRecords] = useState<NoiseData[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  useEffect(() => {
    if (isConfigured) {
      loadRecentRecords();
    }
  }, [isConfigured]);

  const handleSaveConfig = () => {
    updateConfig(formData);
    apiService.setConfig(formData);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);

    try {
      apiService.setConfig(formData);
      const success = await apiService.testConnection();
      setConnectionStatus(success ? 'success' : 'error');
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const loadRecentRecords = async () => {
    setIsLoadingRecords(true);
    try {
      const data = await apiService.getHeatmapData('24h');
      setRecentRecords(data.slice(0, 10)); // Show last 10 records
    } catch (error) {
      console.error('Failed to load recent records:', error);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const getNoiseColor = (level: number) => {
    if (level < 50) return 'text-green-600';
    if (level < 60) return 'text-yellow-600';
    if (level < 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Configure API settings and monitor system status
        </p>
      </div>

      <div className="space-y-8">
        {/* API Configuration */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">API Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Base URL
              </label>
              <input
                type="url"
                value={formData.baseUrl}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                placeholder="https://api.urbannoise.example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Your API key"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveConfig}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Configuration
              </button>
              
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !formData.baseUrl || !formData.apiKey}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>

            {connectionStatus && (
              <div className={`flex items-center space-x-2 p-3 rounded-md ${
                connectionStatus === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {connectionStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span>
                  {connectionStatus === 'success' 
                    ? 'Connection successful!' 
                    : 'Connection failed. Please check your settings.'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* API Endpoints Documentation */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Required API Endpoints</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">GET /heatmapData</h3>
              <p className="text-sm text-gray-600 mt-1">
                Returns noise data points with coordinates, timestamp, label, noise_level, confidence, and optional audio_url
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Query params: timeRange (1h, 24h, 7d)
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">POST /upload</h3>
              <p className="text-sm text-gray-600 mt-1">
                Accepts audio file (base64 or multipart) and location data. Returns ML inference results
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Body: audio (base64), lat (number), lng (number)
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">GET /route</h3>
              <p className="text-sm text-gray-600 mt-1">
                Returns optimal quiet route between two locations
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Query params: start (string), end (string), quiet (boolean)
              </div>
            </div>
          </div>
        </div> */}

        {/* Recent Records */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Records</h2>
            </div>
            <button
              onClick={loadRecentRecords}
              disabled={isLoadingRecords}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoadingRecords ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {isLoadingRecords ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading recent records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Timestamp</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Label</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Noise Level</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-3 px-2">
                        {new Date(record.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">
                        {record.lat.toFixed(4)}, {record.lng.toFixed(4)}
                      </td>
                      <td className="py-3 px-2">{record.label}</td>
                      <td className={`py-3 px-2 font-semibold ${getNoiseColor(record.noise_level)}`}>
                        {record.noise_level.toFixed(1)} dB
                      </td>
                      <td className="py-3 px-2">
                        {(record.confidence * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {recentRecords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No records found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Demo Account Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Demo Account</h2>
          <div className="space-y-2 text-blue-800">
            <p><strong>Base URL:</strong> https://api.urbannoise.demo</p>
            <p><strong>API Key:</strong> demo-key-12345</p>
            <p><strong>Google Maps API Key:</strong> Replace 'AIzaSyDemo_Key_Replace_With_Real_Key' in MapComponent</p>
            <p className="text-sm mt-4 text-blue-700">
              This demo uses mock data. Replace with your actual API endpoints for production use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;