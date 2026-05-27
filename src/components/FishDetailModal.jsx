import { useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import EquipmentCard from './EquipmentCard';

const SEASON_LABELS = {
  spring: { en: '🌷 Spring', fr: '🌷 Printemps' },
  summer: { en: '☀️ Summer', fr: '☀️ Été' },
  fall: { en: '🍂 Fall', fr: '🍂 Automne' },
  winter: { en: '❄️ Winter', fr: '❄️ Hiver' },
};

const SECTION_TITLES = {
  season: { en: 'Season', fr: 'Saison' },
  bestTime: { en: 'Best Time', fr: 'Meilleur moment' },
  techniques: { en: 'Techniques', fr: 'Techniques' },
  regulations: { en: 'Regulations', fr: 'Règlements' },
  recommendedGear: { en: 'Recommended Gear', fr: 'Équipement recommandé' },
};

export default function FishDetailModal({ fish, equipment, onClose }) {
  const { localized } = useTranslation();

  const fishGear = useMemo(() => {
    return equipment.filter((eq) => eq.targetFish.includes(fish.id));
  }, [fish, equipment]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          maxWidth: 580,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '1.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: '#f3f4f6',
            border: 'none',
            borderRadius: 20,
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 18,
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{fish.emoji}</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
              {localized(fish.name)}
            </h2>
            <div style={{ fontSize: 13, color: '#6b7280', fontStyle: 'italic' }}>
              {fish.scientific}
            </div>
          </div>
        </div>

        {/* Seasons */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#374151', marginBottom: 6 }}>
            📅 {localized(SECTION_TITLES.season)}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {fish.seasons.map((s) => (
              <span
                key={s}
                style={{
                  padding: '3px 10px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#1d4ed8',
                  fontWeight: 500,
                }}
              >
                {localized(SEASON_LABELS[s])}
              </span>
            ))}
          </div>
        </div>

        {/* Best Time */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 8,
          padding: '0.6rem 0.8rem',
          marginBottom: 12,
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#92400e', marginBottom: 2 }}>
            🕐 {localized(SECTION_TITLES.bestTime)}
          </div>
          <div style={{ fontSize: 13, color: '#78350f' }}>
            {localized(fish.bestTime)}
          </div>
        </div>

        {/* Techniques */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 8,
          padding: '0.6rem 0.8rem',
          marginBottom: 12,
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#166534', marginBottom: 2 }}>
            🎣 {localized(SECTION_TITLES.techniques)}
          </div>
          <div style={{ fontSize: 13, color: '#14532d' }}>
            {localized(fish.techniques)}
          </div>
        </div>

        {/* Regulations */}
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          padding: '0.6rem 0.8rem',
          marginBottom: 16,
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#991b1b', marginBottom: 2 }}>
            ⚖️ {localized(SECTION_TITLES.regulations)}
          </div>
          <div style={{ fontSize: 13, color: '#7f1d1d' }}>
            {localized(fish.regulations)}
          </div>
        </div>

        {/* Recommended Gear */}
        <div>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: 16, fontWeight: 600, color: '#111827' }}>
            🛒 {localized(SECTION_TITLES.recommendedGear)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fishGear.map((eq) => (
              <EquipmentCard key={eq.id} item={eq} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
