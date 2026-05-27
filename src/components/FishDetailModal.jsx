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
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: 580,
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'var(--color-background)',
            border: 'none',
            borderRadius: 20,
            width: 32,
            height: 32,
            cursor: 'pointer',
            fontSize: 18,
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#e5e7eb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-background)'; }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            border: '1px solid #bbf7d0',
          }}>
            {fish.emoji}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>
              {localized(fish.name)}
            </h2>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              {fish.scientific}
            </div>
          </div>
        </div>

        {/* Seasons */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text)', marginBottom: 6 }}>
            📅 {localized(SECTION_TITLES.season)}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {fish.seasons.map((s) => (
              <span
                key={s}
                style={{
                  padding: '4px 12px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 20,
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

        {/* Wikipedia link */}
        {fish.wiki && (
          <div style={{ marginBottom: 14 }}>
            <a
              href={fish.wiki}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                color: 'var(--color-cta)',
                fontWeight: 500,
                textDecoration: 'underline',
              }}
            >
              📖 Learn more on Wikipedia
            </a>
          </div>
        )}

        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {/* Best Time */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
          }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#92400e', marginBottom: 3 }}>
              🕐 {localized(SECTION_TITLES.bestTime)}
            </div>
            <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.5 }}>
              {localized(fish.bestTime)}
            </div>
          </div>

          {/* Techniques */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
          }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#166534', marginBottom: 3 }}>
              🎣 {localized(SECTION_TITLES.techniques)}
            </div>
            <div style={{ fontSize: 13, color: '#14532d', lineHeight: 1.5 }}>
              {localized(fish.techniques)}
            </div>
          </div>

          {/* Regulations */}
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 0.85rem',
          }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: '#991b1b', marginBottom: 3 }}>
              ⚖️ {localized(SECTION_TITLES.regulations)}
            </div>
            <div style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.5 }}>
              {localized(fish.regulations)}
            </div>
          </div>
        </div>

        {/* Recommended Gear */}
        <div>
          <h3 style={{
            margin: '0 0 0.75rem',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--color-text)',
            paddingBottom: 8,
            borderBottom: '1px solid var(--color-border)',
          }}>
            🛒 {localized(SECTION_TITLES.recommendedGear)}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fishGear.length > 0 ? (
              fishGear.map((eq) => (
                <EquipmentCard key={eq.id} item={eq} />
              ))
            ) : (
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', padding: '0.5rem 0' }}>
                No specific gear recommendations for this species.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
