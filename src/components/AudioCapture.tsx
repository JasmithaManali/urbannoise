import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Upload, Loader, MapPin } from 'lucide-react';
import { usePrivacy } from '../contexts/PrivacyContext';
import { useApi } from '../contexts/ApiContext';
import { apiService } from '../services/api';
import { UploadResponse } from '../types';

const AudioCapture: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [rmsDb, setRmsDb] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { hasAllRequiredConsents, setShowConsentModal } = usePrivacy();
  const { config } = useApi();

  useEffect(() => {
    apiService.setConfig(config);
  }, [config]);

  useEffect(() => {
    if (hasAllRequiredConsents) {
      getCurrentLocation();
    }
  }, [hasAllRequiredConsents]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to NYC for demo
          setLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  };

  const calculateRMS = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);
    const db = 20 * Math.log10(rms / 255) + 94; // Approximate conversion to dB
    setRmsDb(Math.max(0, db));
  };

  const startRecording = async () => {
    if (!hasAllRequiredConsents) {
      setShowConsentModal(true);
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start RMS calculation
      intervalRef.current = setInterval(calculateRMS, 100);

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setUploadResult(null);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRmsDb(null);
    }
  };

  const uploadAudio = async () => {
    if (!audioBlob || !location) {
      setError('No audio or location available for upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await apiService.uploadAudio(audioBlob, location);
      setUploadResult(result);
      setAudioBlob(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload audio. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getNoiseColor = (level: number) => {
    if (level < 50) return 'text-green-600';
    if (level < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Audio Capture</h2>
        {location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Recording Controls */}
        <div className="flex items-center justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="text-center space-y-2">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {recordingTime}s / 10s
            </div>
            {rmsDb !== null && (
              <div className="text-lg font-semibold">
                <span className={getNoiseColor(rmsDb)}>
                  {rmsDb.toFixed(1)} dB
                </span>
              </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(recordingTime / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Section */}
        {audioBlob && !isRecording && (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">Recording complete!</p>
              <p className="text-green-600 text-sm">Duration: {recordingTime}s</p>
            </div>
            
            <button
              onClick={uploadAudio}
              disabled={isUploading || !location}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload & Analyze</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {uploadResult && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{uploadResult.label}</div>
                <div className="text-sm text-gray-600">Detected Sound</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(uploadResult.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getNoiseColor(uploadResult.noise_level)}`}>
                  {uploadResult.noise_level.toFixed(1)} dB
                </div>
                <div className="text-sm text-gray-600">Noise Level</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioCapture;