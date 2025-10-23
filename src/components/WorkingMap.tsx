import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const WorkingMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Define the initialization function
    window.initMap = () => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
        });
        
        // Sample noise data points for heatmap
        const noiseData = [
          { location: new google.maps.LatLng(40.7128, -74.0060), weight: 5 },
          { location: new google.maps.LatLng(40.7200, -74.0100), weight: 8 },
          { location: new google.maps.LatLng(40.7150, -74.0030), weight: 3 },
          { location: new google.maps.LatLng(40.7080, -74.0090), weight: 7 },
          { location: new google.maps.LatLng(40.7220, -74.0150), weight: 9 },
          { location: new google.maps.LatLng(40.7050, -74.0020), weight: 4 },
          { location: new google.maps.LatLng(40.7180, -74.0070), weight: 6 },
          { location: new google.maps.LatLng(40.7100, -74.0120), weight: 2 },
          { location: new google.maps.LatLng(40.7250, -74.0050), weight: 8 },
          { location: new google.maps.LatLng(40.7020, -74.0180), weight: 5 },
        ];
        
        // Create and configure the heatmap layer
        if (google.maps.visualization) {
          const heatmap = new google.maps.visualization.HeatmapLayer({
            data: noiseData,
            map: map,
            radius: 30,
            opacity: 0.7,
            gradient: [
              'rgba(0, 255, 255, 0)',
              'rgba(0, 255, 255, 1)',
              'rgba(0, 191, 255, 1)',
              'rgba(0, 127, 255, 1)',
              'rgba(0, 63, 255, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(0, 0, 223, 1)',
              'rgba(0, 0, 191, 1)',
              'rgba(0, 0, 159, 1)',
              'rgba(0, 0, 127, 1)',
              'rgba(63, 0, 91, 1)',
              'rgba(127, 0, 63, 1)',
              'rgba(191, 0, 31, 1)',
              'rgba(255, 0, 0, 1)'
            ]
          });
          
          console.log("Heatmap initialized successfully");
        } else {
          // Add visualization library if not loaded
          const vizScript = document.createElement('script');
          vizScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU&libraries=visualization&callback=initMap';
          vizScript.async = true;
          vizScript.defer = true;
          document.head.appendChild(vizScript);
          console.log("Loading visualization library");
        }
        
        console.log("Map initialized successfully");
      }
    };
    
    // Load Google Maps script with visualization library
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU&libraries=visualization&callback=initMap';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      // Clean up
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(s => {
        if (s.parentNode) {
          s.parentNode.removeChild(s);
        }
      });
      delete window.initMap;
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
          borderRadius: '8px'
        }}
      ></div>
    </div>
  );
};

export default WorkingMap;