const CATEGORY_ICONS = {
  rod: '🎣',
  reel: '⚙️',
  lure: '🪱',
  bait: '🪰',
  line: '〰️',
  terminal: '🔗',
  tool: '🛠️',
};

const AMAZON_LOGO_URL = 'data:image/svg+xml;base64,' + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="#1a1a1a" d="M13.5 4.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5zm-3 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5zm-9 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5S3.7 6 3 6s-1.5-.7-1.5-1.5zm4.5 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5zM6.3 7.2c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4.3 4.3 4.3-4.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-4.3 4.3 4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0L12 11.8l-4.3 4.3c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l4.3-4.3-4.3-4.3z" transform="translate(0, 1) scale(0.8)"/></svg>'
);

export default function EquipmentCard({ item }) {
  const amazonUrl = `https://www.amazon.ca/dp/${item.asin}?tag=${item.tag}`;

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      overflow: 'hidden',
      transition: 'all var(--transition-normal)',
      boxShadow: 'var(--shadow-sm)',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', gap: 12, padding: '0.75rem' }}>
        {/* Product image placeholder */}
        <div style={{
          width: 80,
          minWidth: 80,
          height: 80,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          border: '1px solid #bbf7d0',
        }}>
          {CATEGORY_ICONS[item.category] || '🎯'}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Category + price row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: 'var(--color-primary)',
              background: '#f0fdf4',
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
            }}>
              {item.category}
            </span>
            {item.priceRange && (
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                {item.priceRange}
              </span>
            )}
          </div>

          {/* Product name */}
          <div style={{
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--color-text)',
            marginBottom: 3,
            lineHeight: 1.3,
          }}>
            {item.name}
          </div>

          {/* Description */}
          <div style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.4,
            marginBottom: 8,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.description}
          </div>

          {/* Buy button */}
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '0.45rem 1.2rem',
              background: 'linear-gradient(to bottom, #ffd166, #f0b400)',
              color: '#1a1a1a',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: 12,
              border: '1px solid #d49a00',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #f0c856, #e0a800)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to bottom, #ffd166, #f0b400)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.5 3.5L20.1 12H7.9L6.5 3.5H21.5zM7.9 12L6.5 3.5H3.5M19 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Buy on Amazon
          </a>
        </div>
      </div>
    </div>
  );
}
