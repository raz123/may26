import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from '../i18n/useTranslation';
import { haversineDistance } from '../hooks/useGeolocation';

// Fix default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const typeColors = {
  public: '#22c55e',
  pourvoirie: '#3b82f6',
  zec: '#f59e0b',
};

function createIcon(type, isSelected) {
  const color = typeColors[type] || '#6b7280';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${isSelected ? 20 : 14}px;
      height: ${isSelected ? 20 : 14}px;
      background: ${color};
      border: 2px solid ${isSelected ? '#fff' : 'transparent'};
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      ${isSelected ? 'transform: scale(1.3);' : ''}
      transition: all 0.15s;
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function FlyToSelected({ spot }) {
  const map = useMap();
  useEffect(() => {
    if (spot) {
      map.flyTo([spot.lat, spot.lng], map.getZoom() < 9 ? 9 : map.getZoom(), {
        duration: 0.5,
      });
    }
  }, [spot, map]);
  return null;
}

function UserLocationMarker({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location && map) {
      map.flyTo([location.lat, location.lng], 9, { duration: 1 });
    }
  }, [location, map]);

  if (!location) return null;

  return (
    <>
      <Circle
        center={[location.lat, location.lng]}
        radius={500}
        pathOptions={{ color: '#ef4444', fillOpacity: 0.1, weight: 2 }}
      />
      <Marker
        position={[location.lat, location.lng]}
        icon={L.divIcon({
          className: 'user-location',
          html: '<div style="width:12px;height:12px;background:#ef4444;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(239,68,68,0.6);"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })}
      >
        <Popup>Your location</Popup>
      </Marker>
    </>
  );
}

export default function MapView({ spots, selectedSpot, onSelectSpot, userLocation }) {
  const { t } = useTranslation();

  const sortedSpots = useMemo(() => {
    if (!userLocation) return spots;
    return [...spots].sort((a, b) => {
      const dA = haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const dB = haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return dA - dB;
    });
  }, [spots, userLocation]);

  return (
    <MapContainer
      center={[48.0, -73.0]}
      zoom={5}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToSelected spot={selectedSpot} />
      <UserLocationMarker location={userLocation} />

      {sortedSpots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createIcon(spot.type, selectedSpot?.id === spot.id)}
          eventHandlers={{
            click: () => onSelectSpot(spot),
          }}
        >
          <Popup>
            <div style={{ fontWeight: 600 }}>{spot.name.en}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{spot.region}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
