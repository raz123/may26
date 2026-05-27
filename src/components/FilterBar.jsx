import { useState, useEffect, useDeferredValue } from 'react';
import { useTranslation } from '../i18n/useTranslation';

const REGIONS = [
  'Abitibi-Témiscamingue',
  'Bas-Saint-Laurent',
  'Centre-du-Québec',
  'Charlevoix–Côte-de-Beaupré',
  'Côte-Nord',
  'Estrie',
  'Lanaudière',
  'Laurentides',
  'Mauricie',
  'Montréal',
  'Nord-du-Québec',
  'Outaouais',
  'Portneuf',
  'Saguenay–Lac-Saint-Jean',
].sort();

const TYPE_STYLES = {
  all: { bg: '#fff', activeBg: 'var(--color-primary)', label: 'Tous' },
  public: { bg: '#fff', activeBg: '#22c55e', label: 'Public' },
  pourvoirie: { bg: '#fff', activeBg: '#3b82f6', label: 'Pourvoirie' },
  zec: { bg: '#fff', activeBg: '#f59e0b', label: 'ZEC' },
};

export default function FilterBar({ filters, onChange, species }) {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState('');
  const deferredSearch = useDeferredValue(localSearch);

  // Sync debounced search up to parent
  useEffect(() => {
    if (deferredSearch !== (filters.search || '')) {
      onChange({ ...filters, search: deferredSearch });
    }
  }, [deferredSearch]);

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 14,
          color: '#9ca3af',
          pointerEvents: 'none',
        }}>🔍</span>
        <input
          type="text"
          placeholder={t('filter.search')}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem 0.5rem 2rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            width: '100%',
            boxSizing: 'border-box',
            color: 'var(--color-text)',
            background: 'var(--color-background)',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
        />
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: 4 }}>
        {['all', 'public', 'pourvoirie', 'zec'].map((type) => {
          const isActive = (type === 'all' && !filters.type) || filters.type === type;
          const colors = TYPE_STYLES[type];
          return (
            <button
              key={type}
              onClick={() => {
                set('type', type === 'all' ? '' : type);
              }}
              title={
                type === 'zec'
                  ? "Zone d'Exploitation Contrôlée — public controlled-harvest territory. Requires daily or seasonal access permit."
                  : ''
              }
              style={{
                flex: 1,
                padding: '0.35rem 0.4rem',
                fontSize: 11,
                border: isActive ? 'none' : `1px solid var(--color-border)`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: isActive ? colors.activeBg : 'var(--color-surface)',
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
                fontWeight: 600,
                transition: 'all var(--transition-fast)',
              }}
            >
              {t(`filter.${type}`)}
              {type === 'zec' && <span style={{ fontSize: 10, marginLeft: 2, opacity: 0.7 }}>ⓘ</span>}
            </button>
          );
        })}
      </div>

      {/* Region + Species inline */}
      <div style={{ display: 'flex', gap: 6 }}>
        <select
          value={filters.region || ''}
          onChange={(e) => set('region', e.target.value)}
          style={{
            flex: 1,
            padding: '0.4rem 0.5rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            color: 'var(--color-text)',
            background: 'var(--color-background)',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <option value="">🌍 {t('region.all')}</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select
          value={filters.species || ''}
          onChange={(e) => set('species', e.target.value)}
          style={{
            flex: 1,
            padding: '0.4rem 0.5rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
            color: 'var(--color-text)',
            background: 'var(--color-background)',
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <option value="">🐟 {t('species.all')}</option>
          {species.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name.en}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
