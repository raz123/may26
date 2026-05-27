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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(spot); }}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              borderBottom: '1px solid var(--color-border)',
              background: isSelected ? 'var(--color-hover-bg)' : 'var(--color-surface)',
              borderLeft: isSelected ? `3px solid ${typeColors[spot.type]}` : '3px solid transparent',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.background = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.background = 'var(--color-surface)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text)', marginBottom: 2 }}>
                  {localized(spot.name)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {spot.region} — {spot.waterBody}
                </div>
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: '#fff',
                background: typeColors[spot.type],
                padding: '2px 7px',
                borderRadius: 'var(--radius-sm)',
              }}>
                {t(`filter.${spot.type}`)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
              {spot.fish.slice(0, 4).map((fid) => {
                const f = species.find((s) => s.id === fid);
                if (!f) return null;
                return (
                  <span key={fid} style={{
                    fontSize: 11,
                    color: 'var(--color-primary)',
                    background: '#f0fdf4',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #bbf7d0',
                  }}>
                    {f.emoji} {localized(f.name)}
                  </span>
                );
              })}
              {spot.fish.length > 4 && (
                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>+{spot.fish.length - 4}</span>
              )}
            </div>

            {dist !== null && (
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                📍 {dist.toFixed(1)} {t('common.distance')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
