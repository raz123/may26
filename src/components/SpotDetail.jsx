import { useState, useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import CompactEquipmentCard from './CompactEquipmentCard';
import FishDetailModal from './FishDetailModal';

const typeColors = {
  public: '#22c55e',
  pourvoirie: '#3b82f6',
  zec: '#f59e0b',
};

function ZECTooltip() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 15,
        height: 15,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.3)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 700,
        cursor: 'help',
        marginLeft: 4,
      }}
      title="Zone d'Exploitation Contrôlée — public controlled-harvest territory managed by the Quebec government. Access requires a daily or seasonal permit."
    >
      ?
    </span>
  );
}

export default function SpotDetail({ spot, species, equipment }) {
  const { t, localized } = useTranslation();
  const [selectedFish, setSelectedFish] = useState(null);

  const spotSpecies = useMemo(() => {
    return species.filter((s) => spot.fish.includes(s.id));
  }, [spot, species]);

  const recommendedGear = useMemo(() => {
    const targetFishIds = new Set(spot.fish);
    return equipment.filter((eq) =>
      eq.targetFish.some((fid) => targetFishIds.has(fid))
    );
  }, [spot, equipment]);

  return (
    <div style={{ padding: '0.75rem 1rem 1rem', overflowY: 'auto', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
            {localized(spot.name)}
          </h2>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: '#fff',
            background: typeColors[spot.type],
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex',
            alignItems: 'center',
          }}>
            {t(`spot.type.${spot.type}`)}
            {spot.type === 'zec' && <ZECTooltip />}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
          {spot.region} — {spot.waterBody}
        </div>
      </div>

      {/* Description + Outfitter link */}
      <div style={{
        background: 'var(--color-background)',
        borderRadius: 'var(--radius-md)',
        padding: '0.65rem 0.85rem',
        marginBottom: '0.75rem',
        fontSize: 13,
        color: 'var(--color-text)',
        lineHeight: 1.5,
      }}>
        <div>{localized(spot.description)}</div>
        {spot.type === 'pourvoirie' && spot.pourvoirieUrl && (
          <div style={{ marginTop: 6 }}>
            <a
              href={spot.pourvoirieUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-cta)',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              {t('spot.pourvoirieLink')} →
            </a>
          </div>
        )}
      </div>

      {/* Fish Species */}
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
          🐟 {t('spot.fishSpecies')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {spotSpecies.map((f) => (
            <div
              key={f.id}
              onClick={() => setSelectedFish(f)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedFish(f); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.45rem 0.65rem',
                background: '#f0fdf4',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bbf7d0',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#dcfce7';
                e.currentTarget.style.borderColor = '#86efac';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f0fdf4';
                e.currentTarget.style.borderColor = '#bbf7d0';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{f.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)' }}>
                  {localized(f.name)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                  {f.scientific}
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--color-cta)', fontWeight: 500 }}>
                Details →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Gear — compact grid */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h3 style={{
          margin: '0 0 0.65rem',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--color-text)',
          paddingBottom: 6,
          borderBottom: '1px solid var(--color-border)',
        }}>
          🎣 {t('spot.recommendedGear')}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
        }}>
          {recommendedGear.map((eq) => (
            <CompactEquipmentCard key={eq.id} item={eq} />
          ))}
        </div>
      </div>

      {selectedFish && (
        <FishDetailModal
          fish={selectedFish}
          equipment={equipment}
          onClose={() => setSelectedFish(null)}
        />
      )}
    </div>
  );
}
