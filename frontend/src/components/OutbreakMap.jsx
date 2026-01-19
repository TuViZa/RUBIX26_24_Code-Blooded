import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const OutbreakMap = () => {
  const [hospitalData, setHospitalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOutbreakView, setShowOutbreakView] = useState(true);

  // Mumbai center coordinates
  const mumbaiCenter = [19.0760, 72.8777];

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        setLoading(true);
        console.log('Fetching from: http://localhost:5000/api/hospital/heatmap-data');
        
        const response = await fetch('http://localhost:5000/api/hospital/heatmap-data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Hospitals Loaded:', data);
        
        setHospitalData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
        setError('Failed to load heatmap data');
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchHeatmapData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const blueIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #3B82F6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading outbreak map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-xl">
        <div className="text-center">
          <div className="text-critical mb-2">⚠️</div>
          <p className="text-critical">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden border border-border relative">
      {/* Toggle Button */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-2">
        <Button
          variant={showOutbreakView ? "default" : "outline"}
          size="sm"
          onClick={() => setShowOutbreakView(!showOutbreakView)}
          className="flex items-center gap-2"
        >
          {showOutbreakView ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              Outbreak View
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Hospital View
            </>
          )}
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="font-medium">Red Zone = High Patient Load / Potential Outbreak</span>
        </div>
      </div>

      <MapContainer
        center={mumbaiCenter}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Heatmap View - Show intensity as colored circles */}
        {showOutbreakView && hospitalData.map((hospital, index) => {
          const intensity = hospital.intensity || 0.5;
          const size = Math.max(30, intensity * 100);
          
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: `rgba(255, ${Math.floor(100 * (1 - intensity))}, ${Math.floor(100 * (1 - intensity))}, ${intensity * 0.9})`,
                left: `${((hospital.lng - 72.8777) * 50) + 50}%`,
                top: `${((19.0760 - hospital.lat) * 50) + 50}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                border: '3px solid rgba(255, 255, 255, 0.6)',
                boxShadow: `0 0 ${size/2}px rgba(255, ${Math.floor(150 * (1 - intensity))}, ${Math.floor(150 * (1 - intensity))}, ${intensity * 0.7})`,
                pointerEvents: 'none'
              }}
            />
          );
        })}
        
        {/* Hospital View - Show markers */}
        {!showOutbreakView && hospitalData.map((hospital, index) => (
          <Marker
            key={index}
            position={[hospital.lat, hospital.lng]}
            icon={blueIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong>Hospital Location</strong><br />
                Lat: {hospital.lat.toFixed(4)}<br />
                Lng: {hospital.lng.toFixed(4)}<br />
                Load: {(hospital.intensity * 100).toFixed(1)}%
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default OutbreakMap;
