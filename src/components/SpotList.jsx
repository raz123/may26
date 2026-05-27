import { useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { haversineDistance } from '../hooks/useGeolocation';

const typeColors = {
  public: '#22c55e',
  pourvoirie: '#3b82f6',
  zec: '#f59e0b',
};

export default function SpotList({ spots, selected, onSelect, userLocation, species }) {
  const { t, localized } = useTranslation();

  const sorted = useMemo(() => {
    if (!userLocation || !spots.length) return spots;
    return [...spots].sort((a, b) => {
      const dA = haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const dB = haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return dA - dB;
    });
  }, [spots, userLocation]);

  if (!sorted.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
        No spots match your filters.
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {sorted.map((spot) => {
        const isSelected = selected?.id === spot.id;
        const dist = userLocation
          ? haversineDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng)
          : null;

        return (
          <div
            key={spot.id}
            onClick={() => onSelect(spot)}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              borderBottom: '1px solid #f3f4f6',
              background: isSelected ? '#eff6ff' : '#fff',
              borderLeft: isSelected ? `3px solid ${typeColors[spot.type]}` : '3px solid transparent',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f9fafb'; }}
            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = '#fff'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 }}>
                  {localized(spot.name)}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {spot.region} — {spot.waterBody}
                </div>
              </div>
              <div>
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: typeColors[spot.type],
                  padding: '2px 6px',
                  borderRadius: 3,
                }}>
                  {t(`filter.${spot.type}`)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
              {spot.fish.slice(0, 4).map((fid) => {
                const f = species.find((s) => s.id === fid);
                if (!f) return null;
                return (
                  <span key={fid} style={{ fontSize: 11, color: '#374151', background: '#f3f4f6', padding: '1px 5px', borderRadius: 3 }}>
                    {f.emoji} {localized(f.name)}
                  </span>
                );
              })}
              {spot.fish.length > 4 && (
                <span style={{ fontSize: 11, color: '#6b7280' }}>+{spot.fish.length - 4}</span>
              )}
            </div>

            {dist !== null && (
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                {dist.toFixed(1)} {t('common.distance')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
