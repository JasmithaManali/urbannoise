import React from 'react';
import WorkingMap from '../components/WorkingMap';
import AudioRecorder from '../components/AudioRecorder';
import NoiseLevel from '../components/NoiseLevel';
import HeroSection from '../components/HeroSection';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Urban Noise Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor and analyze environmental noise patterns in your city
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Map - Takes up 2/3 of the space on xl screens */}
            <div className="xl:col-span-2">
              <WorkingMap />
            </div>
          
          {/* Audio Capture - Takes up 1/3 of the space on xl screens */}
          <div className="xl:col-span-1">
            <AudioRecorder />
            <div className="mt-8">
              <NoiseLevel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;