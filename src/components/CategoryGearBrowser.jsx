import { useState, useMemo } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import speciesData from '../data/species.json';

const CATEGORY_CONFIG = [
  { id: 'rod', emoji: '🎣', label: { en: 'Rods', fr: 'Canne à pêche' } },
  { id: 'reel', emoji: '⚙️', label: { en: 'Reels', fr: 'Moulinets' } },
  { id: 'lure', emoji: '🐟', label: { en: 'Lures', fr: 'Leurres' } },
  { id: 'bait', emoji: '🐛', label: { en: 'Bait', fr: 'Appâts' } },
  { id: 'line', emoji: '〰️', label: { en: 'Line', fr: 'Fil de pêche' } },
  { id: 'terminal', emoji: '🔗', label: { en: 'Terminal', fr: 'Terminal' } },
  { id: 'tool', emoji: '🛠️', label: { en: 'Tools', fr: 'Outils' } },
];

export default function CategoryGearBrowser({ equipment }) {
  const { t, lang, localized } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');

  // Group equipment by category
  const categories = useMemo(() => {
    const map = {};
    equipment.forEach((eq) => {
      if (!map[eq.category]) map[eq.category] = [];
      map[eq.category].push(eq);
    });
    return map;
  }, [equipment]);

  // Items to show for active tab
  const visibleItems = useMemo(() => {
    if (activeTab === 'all') return equipment;
    return categories[activeTab] || [];
  }, [activeTab, equipment, categories]);

  // Tabs that actually have items
  const availableTabs = useMemo(() => {
    return CATEGORY_CONFIG.filter((c) => categories[c.id]?.length > 0);
  }, [categories]);

  // If only 1 category has items, default to 'all'
  // (but don't override user's tab choice after they've clicked)

  if (equipment.length === 0) {
    return (
      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic', padding: '0.5rem 0' }}>
        {t('equipment.none')}
      </div>
    );
  }

  return (
    <div>
      {/* Tab bar — horizontal scroll on mobile */}
      <div style={{
        display: 'flex',
        gap: 4,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: 10,
        borderBottom: '1px solid var(--color-border)',
        WebkitOverflowScrolling: 'touch',
      }}>
        <TabButton
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
          label={t('equipment.all')}
          count={equipment.length}
        />
        {availableTabs.map((cat) => (
          <TabButton
            key={cat.id}
            active={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
            emoji={cat.emoji}
            label={cat.label[lang]}
            count={categories[cat.id].length}
          />
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: '0.5rem',
      }}>
        {visibleItems.map((item) => (
          <GearCard key={item.id} item={item} localized={localized} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, emoji, label, count }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '0.35rem 0.7rem',
        border: active ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
        borderRadius: '20px',
        background: active ? 'var(--color-primary)' : 'var(--color-surface)',
        color: active ? '#fff' : 'var(--color-text)',
        fontWeight: active ? 700 : 500,
        fontSize: 12,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all var(--transition-fast)',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {emoji && <span style={{ fontSize: 14 }}>{emoji}</span>}
      <span>{label}</span>
      <span style={{
        fontSize: 10,
        background: active ? 'rgba(255,255,255,0.25)' : 'var(--color-background)',
        borderRadius: '10px',
        padding: '0 5px',
        minWidth: 18,
        textAlign: 'center',
      }}>
        {count}
      </span>
    </button>
  );
}

function GearCard({ item, localized, lang }) {
  const amazonUrl = `https://www.amazon.ca/dp/${item.asin}?tag=${item.tag}`;

  // Fish badges
  const fishNames = useMemo(() => {
    return item.targetFish
      .map((fid) => speciesData.find((s) => s.id === fid))
      .filter(Boolean);
  }, [item.targetFish]);

  const catConfig = CATEGORY_CONFIG.find((c) => c.id === item.category);
  const emoji = catConfig?.emoji || '🎯';

  // Mock rating based on category (affiliate trust signal)
  const stars = '★★★★★';

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all var(--transition-fast)',
      position: 'relative',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {/* Icon circle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 0.5rem 0.2rem',
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          border: '1px solid #bbf7d0',
        }}>
          {emoji}
        </div>
      </div>

      {/* Name */}
      <div style={{
        padding: '0.2rem 0.65rem 0',
        fontWeight: 700,
        fontSize: 13,
        color: 'var(--color-text)',
        lineHeight: 1.35,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        minHeight: 35,
      }}>
        {item.name}
      </div>

      {/* Stars + Price row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.25rem 0.65rem 0',
        gap: 4,
      }}>
        <span style={{
          fontSize: 10,
          color: '#eab308',
          letterSpacing: 1,
          whiteSpace: 'nowrap',
        }}>
          {stars}
        </span>
        <span style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--color-text)',
          whiteSpace: 'nowrap',
        }}>
          {item.priceRange}
        </span>
      </div>

      {/* Buy button */}
      <div style={{ padding: '0.35rem 0.65rem 0.4rem' }}>
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: '0.4rem 0.5rem',
            background: 'linear-gradient(to bottom, #ffd166, #f0b400)',
            color: '#1a1a1a',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: 12,
            border: '1px solid #d49a00',
            transition: 'all var(--transition-fast)',
            width: '100%',
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to bottom, #f0c856, #e0a800)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to bottom, #ffd166, #f0b400)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zm-1.45-5.5H8.1L7 10h13l-1.75 7.5H7.75l-.25-1.5h9.55l1.5-6.5H6.2L5.27 6H3v2h1l3.6 7.5h9.8l1.75-7.5H21v-2h-4l-.45 2z"/>
          </svg>
          Buy on Amazon
        </a>
      </div>

      {/* Fish badges — subtle, bottom */}
      <div style={{
        padding: '0 0.65rem 0.5rem',
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
      }}>
        {fishNames.slice(0, 4).map((f) => (
          <span
            key={f.id}
            title={localized(f.name)}
            style={{
              fontSize: 9,
              padding: '1px 4px',
              borderRadius: 'var(--radius-sm)',
              background: '#f9fafb',
              color: '#6b7280',
              border: '1px solid #e5e7eb',
            }}
          >
            {f.emoji}
          </span>
        ))}
        {fishNames.length > 4 && (
          <span style={{
            fontSize: 9,
            padding: '1px 4px',
            borderRadius: 'var(--radius-sm)',
            background: '#f9fafb',
            color: '#6b7280',
          }}>
            +{fishNames.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}
