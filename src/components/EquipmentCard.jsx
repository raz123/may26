import { useTranslation } from '../i18n/useTranslation';

const CATEGORY_EMOJI = {
  rod: '🎣',
  reel: '⚙️',
  lure: '🪱',
  bait: '🪰',
  line: '〰️',
  terminal: '🔗',
  tool: '🛠️',
};

export default function EquipmentCard({ item }) {
  const { t } = useTranslation();

  const amazonUrl = `https://www.amazon.ca/dp/${item.asin}?tag=${item.tag}`;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '0.75rem',
      background: '#fff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
        {CATEGORY_EMOJI[item.category] || '🎯'} {t('equipment.category')}: {item.category}
      </div>

      <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 4 }}>
        {item.name}
      </div>

      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6, lineHeight: 1.4 }}>
        {item.description}
      </div>

      {item.priceRange && (
        <div style={{ fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 8 }}>
          {item.priceRange}
        </div>
      )}

      <a
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        style={{
          display: 'inline-block',
          padding: '0.4rem 1rem',
          background: '#ff9900',
          color: '#000',
          textDecoration: 'none',
          borderRadius: 4,
          fontWeight: 600,
          fontSize: 13,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#e88f00'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#ff9900'}
      >
        {t('equipment.buyOnAmazon')} →
      </a>
    </div>
  );
}
