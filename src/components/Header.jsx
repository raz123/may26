import { useTranslation } from '../i18n/useTranslation';

export default function Header({ onNearMe, userLocation, loading }) {
  const { t, toggleLang, lang } = useTranslation();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.625rem 1rem',
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      zIndex: 1000,
      position: 'relative',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
          🎣 {t('app.title')}
        </h1>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{t('app.subtitle')}</div>
      </div>

      <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={onNearMe}
          disabled={loading}
          style={{
            padding: '0.4rem 0.75rem',
            background: userLocation ? 'var(--color-secondary)' : 'var(--color-cta)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            opacity: loading ? 0.7 : 1,
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={(e) => { if (!loading) e.currentTarget.style.opacity = '1'; }}
        >
          {loading ? '⏳' : '📍'} {t('common.nearMe')}
        </button>

        <button
          onClick={toggleLang}
          style={{
            padding: '0.4rem 0.6rem',
            background: 'var(--color-background)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-hover-bg)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-background)'; }}
        >
          {t('language.toggle')}
        </button>
      </nav>
    </header>
  );
}
