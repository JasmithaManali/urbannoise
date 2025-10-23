import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Volume2, CheckCircle } from 'lucide-react';


const HeroSection: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <section className="relative min-h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Volume2 className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Urban Noise</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between pt-28 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Secure Noise Monitoring</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Monitor and <span className="text-blue-600">analyze noise</span> instantly.
          </h1>
          <ul className="space-y-3 text-lg mb-8">
            <li className="flex items-center justify-center lg:justify-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <span>Real-time noise data collection</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <span>Advanced soundscape analysis</span>
            </li>
            <li className="flex items-center justify-center lg:justify-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <span>Contribute to quieter urban environments</span>
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold flex items-center justify-center">
              Explore Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-lg font-semibold">
              Learn More
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">*Data secured and anonymized</p>
        </div>
        
        <div className="lg:w-1/2 flex justify-center lg:justify-end relative">
          {/* Placeholder for the main image/illustration */}
          <div className="relative w-full max-w-lg h-96 bg-gray-200 rounded-lg shadow-xl flex items-center justify-center overflow-hidden">
            <img 
              src="https://i.pinimg.com/1200x/59/dc/8d/59dc8d5e3d8946197e4ac276970a595b.jpg" 
              alt="Urban Noise Monitoring" 
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50"></div>
            <span className="relative text-white text-2xl font-bold z-10">Live Noise Data</span>
          </div>

          {/* Example data cards (similar to the VPN UI) */}
          <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-11/12 max-w-md bg-white p-6 rounded-lg shadow-xl border border-gray-200 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Current Noise Level</span>
              <span className="text-lg font-bold text-blue-600">65 dB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Data Uploaded (24h)</span>
              <span className="text-base font-semibold text-gray-800">4.5 MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Recordings Processed (24h)</span>
              <span className="text-base font-semibold text-gray-800">120</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-400 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;