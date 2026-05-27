import { useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import EquipmentCard from './EquipmentCard';

const typeColors = {
  public: '#22c55e',
  pourvoirie: '#3b82f6',
  zec: '#f59e0b',
};

export default function SpotDetail({ spot, species, equipment }) {
  const { t } = useTranslation();

  const spotSpecies = useMemo(() => {
    return species.filter((s) => spot.fish.includes(s.id));
  }, [spot, species]);

  const recommendedGear = useMemo(() => {
    // Get equipment that targets any of the fish species at this spot
    const targetFishIds = new Set(spot.fish);
    return equipment.filter((eq) =>
      eq.targetFish.some((fid) => targetFishIds.has(fid))
    );
  }, [spot, equipment]);

  return (
    <div style={{ padding: '0 1rem 1rem', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>
            {spot.name.en}
          </h2>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#fff',
            background: typeColors[spot.type],
            padding: '2px 8px',
            borderRadius: 3,
          }}>
            {t(`spot.type.${spot.type}`)}
          </span>
        </div>
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          {spot.region} — {spot.waterBody}
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: '#f9fafb',
        borderRadius: 8,
        padding: '0.75rem',
        marginBottom: '1rem',
        fontSize: 14,
        color: '#374151',
        lineHeight: 1.5,
      }}>
        {spot.description.en}
      </div>

      {/* Outfitter link */}
      {spot.type === 'pourvoirie' && spot.pourvoirieUrl && (
        <div style={{ marginBottom: '1rem' }}>
          <a
            href={spot.pourvoirieUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              color: '#2563eb',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'underline',
            }}
          >
            {t('spot.pourvoirieLink')} →
          </a>
        </div>
      )}

      {/* Fish Species */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: 16, fontWeight: 600, color: '#111827' }}>
          🐟 {t('spot.fishSpecies')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {spotSpecies.map((f) => (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.5rem 0.75rem',
                background: '#f0fdf4',
                borderRadius: 6,
                border: '1px solid #dcfce7',
              }}
            >
              <span style={{ fontSize: 20 }}>{f.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>
                  {f.name.en} / {f.name.fr}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
                  {f.scientific}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Gear */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ margin: '0 0 0.75rem', fontSize: 16, fontWeight: 600, color: '#111827' }}>
          🎣 {t('spot.recommendedGear')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recommendedGear.map((eq) => (
            <EquipmentCard key={eq.id} item={eq} />
          ))}
        </div>
      </div>
    </div>
  );
}
