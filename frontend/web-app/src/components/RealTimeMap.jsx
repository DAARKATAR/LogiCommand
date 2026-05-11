import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { TrackingService, GpsService } from '../services/api';

// Fix default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', // Delivery truck icon
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const originIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/644/644468.png', // Circle icon
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const destIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png', // Pin icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ChangeView({ bounds, center }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 1) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch (e) {
        console.warn("Invalid bounds", e);
      }
    } else if (center) {
      map.setView(center, 13);
    }
  }, [bounds, center, map]);
  return null;
}

const RealTimeMap = ({ zoom = 13, selectedOrder = null }) => {
  const { t } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [realisticRoute, setRealisticRoute] = useState(null);
  const [realisticRouteRemaining, setRealisticRouteRemaining] = useState(null);
  
  const origin = selectedOrder?.originLat ? [selectedOrder.originLat, selectedOrder.originLng] : null;
  const destination = selectedOrder?.destinationLat ? [selectedOrder.destinationLat, selectedOrder.destinationLng] : null;

  // Use primitive dependencies to avoid infinite loops
  const orderId = selectedOrder?.id;
  const originLat = selectedOrder?.originLat;
  const originLng = selectedOrder?.originLng;

  useEffect(() => {
    if (orderId) {
      const orig = originLat ? [originLat, originLng] : null;
      TrackingService.getHistory(orderId)
        .then(res => {
          let curr = orig;
          if (res.data && res.data.length > 0) {
            const latest = res.data[res.data.length - 1];
            curr = [latest.latitude, latest.longitude];
          }
          setCurrentLocation(curr);
          
          if (orig && curr) {
            GpsService.getRealisticRoute({
              originLat: orig[0],
              originLng: orig[1],
              destLat: curr[0],
              destLng: curr[1]
            }).then(r => {
               if(r.data && r.data.geometry) setRealisticRoute(r.data.geometry);
            });
          }

          if (curr && destination) {
            GpsService.getRealisticRoute({
              originLat: curr[0],
              originLng: curr[1],
              destLat: destination[0],
              destLng: destination[1]
            }).then(r => {
               if(r.data && r.data.geometry) setRealisticRouteRemaining(r.data.geometry);
            });
          }
        })
        .catch(err => {
          console.error("Tracking Error:", err);
          setCurrentLocation(orig);
        });
    } else {
        setCurrentLocation(null);
        setRealisticRoute(null);
        setRealisticRouteRemaining(null);
    }
  }, [orderId, originLat, originLng, destination?.[0], destination?.[1]]);

  // Default to Bogota if nothing is selected
  const defaultPosition = [4.6097, -74.0817];
  
  // Calculate bounds to fit everything nicely
  const points = [];
  if (origin) points.push(origin);
  if (currentLocation) {
    // Check if current location is different from origin to avoid 0-area bounds
    if (!origin || currentLocation[0] !== origin[0] || currentLocation[1] !== origin[1]) {
      points.push(currentLocation);
    }
  }
  if (destination) {
    if (!origin || destination[0] !== origin[0] || destination[1] !== origin[1]) {
      points.push(destination);
    }
  }

  const bounds = points.length > 1 ? points : null;
  const centerPos = origin || defaultPosition;

  return (
    <div className="h-[600px] w-full overflow-hidden border border-stealth-700 relative">
      <MapContainer 
        center={centerPos} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="h-full w-full grayscale-[0.9] invert-[0.9] hue-rotate-[180deg]"
      >
        <ChangeView bounds={bounds} center={!bounds ? centerPos : null} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Waze Style Routes */}
        {realisticRoute ? (
          <Polyline 
            positions={realisticRoute} 
            pathOptions={{ color: '#8b5cf6', weight: 8, opacity: 0.9 }} 
          />
        ) : origin && currentLocation && (
          <Polyline 
            positions={[origin, currentLocation]} 
            pathOptions={{ color: '#8b5cf6', weight: 8, opacity: 0.9 }} 
          />
        )}
        
        {realisticRouteRemaining ? (
          <Polyline 
            positions={realisticRouteRemaining} 
            pathOptions={{ color: '#a855f7', weight: 6, dashArray: '10, 15', opacity: 0.7 }} 
          />
        ) : currentLocation && destination && (
          <Polyline 
            positions={[currentLocation, destination]} 
            pathOptions={{ color: '#a855f7', weight: 6, dashArray: '10, 15', opacity: 0.7 }} 
          />
        )}

        {origin && (
          <Marker position={origin} icon={originIcon}>
            <Popup><span className="text-stealth-900 font-bold uppercase">UBICACIÓN INICIAL: {selectedOrder.originAddress}</span></Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination} icon={destIcon}>
            <Popup><span className="text-stealth-900 font-bold uppercase">UBICACIÓN FINAL: {selectedOrder.destinationAddress}</span></Popup>
          </Marker>
        )}

        {currentLocation && ['ASSIGNED', 'IN_TRANSIT'].includes(selectedOrder?.status) && (
          <Marker position={currentLocation} icon={truckIcon}>
             <Popup><span className="text-stealth-900 font-bold uppercase">UBICACIÓN ACTUAL: UNIDAD {selectedOrder.id}</span></Popup>
          </Marker>
        )}

        {!selectedOrder && (
          <Marker position={defaultPosition}>
            <Popup>
              <div className="p-2 font-sans">
                <p className="font-bold text-stealth-900 text-lg uppercase tracking-wider">{t('map.title')}</p>
              </div>
            </Popup>
          </Marker>
        )}

      </MapContainer>

      {/* Map Overlay Controls */}
      <div className="absolute bottom-6 left-6 z-[1000] flex gap-3">
        <div className="bg-stealth-800 border border-stealth-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-accent-emerald animate-pulse"></div>
          {selectedOrder ? `Ruta Activa #${selectedOrder.id}` : t('map.region')}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMap;
