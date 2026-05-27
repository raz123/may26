import { useTranslation } from '../i18n/useTranslation';

const CATEGORY_EMOJI = {
  rod: { en: '🎣 Rod', fr: '🎣 Canne' },
  reel: { en: '⚙️ Reel', fr: '⚙️ Moulinet' },
  lure: { en: '🪱 Lure', fr: '🪱 Leurre' },
  bait: { en: '🪰 Bait', fr: '🪰 Appât' },
  line: { en: '〰️ Line', fr: '〰️ Fil' },
  terminal: { en: '🔗 Terminal', fr: '🔗 Terminaison' },
  tool: { en: '🛠️ Tool', fr: '🛠️ Outil' },
};

export default function EquipmentCard({ item }) {
  const { localized } = useTranslation();

  const amazonUrl = `https://www.amazon.ca/dp/${item.asin}?tag=${item.tag}`;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      background: '#fff',
      overflow: 'hidden',
      transition: 'box-shadow 0.15s, transform 0.15s',
      cursor: 'default',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', gap: 12, padding: '0.75rem' }}>
        {/* Product image placeholder */}
        <div style={{
          width: 80,
          minWidth: 80,
          height: 80,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color: '#9ca3af',
          border: '1px solid #e5e7eb',
        }}>
          {CATEGORY_EMOJI[item.category]?.['en']?.split(' ')[0] || '🎯'}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Category badge */}
          <div style={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#6b7280',
            marginBottom: 3,
          }}>
            {localized(CATEGORY_EMOJI[item.category] || { en: '🎯 Gear', fr: '🎯 Équipement' })}
          </div>

          {/* Product name */}
          <div style={{
            fontWeight: 700,
            fontSize: 14,
            color: '#111827',
            marginBottom: 3,
            lineHeight: 1.3,
          }}>
            {item.name}
          </div>

          {/* Description */}
          <div style={{
            fontSize: 12,
            color: '#6b7280',
            lineHeight: 1.4,
            marginBottom: 6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.description}
          </div>

          {/* Price + Buy button row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {item.priceRange && (
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#111827',
              }}>
                {item.priceRange}
              </div>
            )}

            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '0.4rem 1rem',
                background: 'linear-gradient(to bottom, #ffd166, #f0b400)',
                color: '#1a1a1a',
                textDecoration: 'none',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 12,
                border: '1px solid #d49a00',
                transition: 'all 0.1s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #f0c856, #e0a800)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to bottom, #ffd166, #f0b400)';
              }}
            >
              <span style={{ fontSize: 14 }}>🛒</span>
              Buy on Amazon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
