import { useTranslation } from '../i18n/useTranslation';
import speciesData from '../data/species.json';

const CAT_EMOJI = {
  rod: '🎣', reel: '⚙️', lure: '🪱', bait: '🪰',
  line: '〰️', terminal: '🔗', tool: '🛠️',
};

export default function CompactEquipmentCard({ item }) {
  const amazonUrl = `https://www.amazon.ca/dp/${item.asin}?tag=${item.tag}`;

  // Which fish this item targets (show names)
  const targetFishNames = item.targetFish
    .map((fid) => speciesData.find((s) => s.id === fid))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '0.6rem 0.65rem',
      background: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      transition: 'all var(--transition-fast)',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Top row: emoji + name + price */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>{CAT_EMOJI[item.category] || '🎯'}</span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--color-text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {item.name}
          </span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {item.priceRange}
        </div>
      </div>

      {/* Fish badges + buy button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', minWidth: 0 }}>
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            background: '#f0fdf4',
            padding: '1px 5px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #bbf7d0',
          }}>
            {item.category}
          </span>
          {targetFishNames.map((f) => (
            <span key={f.id} style={{
              fontSize: 9,
              color: '#6b7280',
              background: '#f9fafb',
              padding: '1px 4px',
              borderRadius: 'var(--radius-sm)',
            }}>
              {f.emoji}{f.name.en.split(' ')[0]}
            </span>
          ))}
        </div>

        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '0.25rem 0.6rem',
            background: 'linear-gradient(to bottom, #ffd166, #f0b400)',
            color: '#1a1a1a',
            textDecoration: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: 10,
            border: '1px solid #d49a00',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom, #f0c856, #e0a800)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom, #ffd166, #f0b400)'}
        >
          🛒 Buy
        </a>
      </div>
    </div>
  );
}
