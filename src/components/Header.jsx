import { useTranslation } from '../i18n/useTranslation';
import { useGeolocation } from '../hooks/useGeolocation';

export default function Header({ onNearMe, userLocation, loading }) {
  const { t, toggleLang, lang } = useTranslation();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 1rem',
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      zIndex: 1000,
      position: 'relative',
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
          🎣 {t('app.title')}
        </h1>
        <div style={{ fontSize: 11, color: '#9ca3af' }}>{t('app.subtitle')}</div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button
          onClick={onNearMe}
          disabled={loading}
          style={{
            padding: '0.4rem 0.75rem',
            background: userLocation ? '#22c55e' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '⏳' : '📍'} {t('common.nearMe')}
        </button>

        <button
          onClick={toggleLang}
          style={{
            padding: '0.4rem 0.6rem',
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {t('language.toggle')}
        </button>
      </div>
    </header>
  );
}
