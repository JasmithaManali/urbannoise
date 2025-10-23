import React, { useEffect, useRef } from 'react';
import './MapStyles.css';

const SimpleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Function to initialize the map
    const initMap = () => {
      if (!mapRef.current) {
        console.error('Map container not found');
        return;
      }
      
      try {
        console.log('Initializing map...');
        const mapOptions = {
          center: { lat: 40.7128, lng: -74.0060 }, // New York City
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        const map = new google.maps.Map(mapRef.current, mapOptions);
        
        // Add a marker
        new google.maps.Marker({
          position: { lat: 40.7128, lng: -74.0060 },
          map: map,
          title: 'New York City'
        });
        
        console.log('Map initialized successfully');
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };
    
    // Check if Google Maps API is loaded
    if (window.google && window.google.maps) {
      console.log('Google Maps API already loaded');
      initMap();
    } else {
      console.log('Waiting for Google Maps API to load...');
      // Wait for Google Maps to load
      const checkGoogleMapsLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMapsLoaded);
          console.log('Google Maps API loaded');
          initMap();
        }
      }, 100);
      
      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => clearInterval(checkGoogleMapsLoaded), 10000);
    }
    
    return () => {
      // Cleanup
    };
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Noise Map</h2>
      <div 
        ref={mapRef} 
        style={{
          width: '100%',
          height: '500px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0.5rem'
        }}
      ></div>
    </div>
  );
};

export default SimpleMap;