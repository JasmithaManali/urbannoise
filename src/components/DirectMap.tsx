import React, { useEffect } from 'react';

const DirectMap: React.FC = () => {
  useEffect(() => {
    // Create a script to initialize the map after component mounts
    const script = document.createElement('script');
    script.innerHTML = `
      function initializeMap() {
        if (!window.google) {
          console.error('Google Maps not loaded');
          setTimeout(initializeMap, 500);
          return;
        }
        
        const mapElement = document.getElementById('google-map');
        if (!mapElement) {
          console.error('Map container not found');
          return;
        }
        
        try {
          const map = new google.maps.Map(mapElement, {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });
          
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
      }
      
      // Try to initialize immediately
      initializeMap();
    `;
    document.body.appendChild(script);
    
    return () => {
      // Clean up
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Noise Map</h2>
      <div 
        id="google-map" 
        style={{
          width: '100%',
          height: '500px',
          position: 'relative',
          borderRadius: '0.5rem'
        }}
      ></div>
    </div>
  );
};

export default DirectMap;