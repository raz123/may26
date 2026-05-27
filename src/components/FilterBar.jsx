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

const TYPE_INFO = {
  all: '',
  public: 'Free public access — no permit required beyond fishing license.',
  pourvoirie: 'Outfitter (pourvoirie) — pay-per-day or package. Lodging, boat, and guides often included.',
  zec: "ZEC (Zone d'Exploitation Contrôlée) — public controlled-harvest territory. Requires daily or seasonal access permit. Managed by local associations.",
};

export default function FilterBar({ filters, onChange, species }) {
  const { t } = useTranslation();

  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* Search */}
      <input
        type="text"
        placeholder={t('filter.search')}
        value={filters.search || ''}
        onChange={(e) => set('search', e.target.value)}
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: 6,
          fontSize: 14,
          width: '100%',
          boxSizing: 'border-box',
        }}
      />

      {/* Type filter */}
      <div style={{ display: 'flex', gap: 4 }}>
        {['all', 'public', 'pourvoirie', 'zec'].map((type) => (
          <button
            key={type}
            onClick={() => set('type', type === 'all' ? '' : type)}
            title={TYPE_INFO[type]}
            style={{
              flex: 1,
              padding: '0.3rem 0.5rem',
              fontSize: 12,
              border: '1px solid #d1d5db',
              borderRadius: 4,
              cursor: 'pointer',
              background: (type === 'all' && !filters.type) || filters.type === type ? '#2563eb' : '#fff',
              color: (type === 'all' && !filters.type) || filters.type === type ? '#fff' : '#374151',
              fontWeight: 500,
            }}
          >
            {t(`filter.${type}`)}
            {type === 'zec' && <span style={{ fontSize: 10, marginLeft: 2, opacity: 0.7 }}>ⓘ</span>}
          </button>
        ))}
      </div>

      {/* Region */}
      <select
        value={filters.region || ''}
        onChange={(e) => set('region', e.target.value)}
        style={{
          padding: '0.4rem 0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: 4,
          fontSize: 13,
          width: '100%',
        }}
      >
        <option value="">{t('region.all')}</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {/* Species */}
      <select
        value={filters.species || ''}
        onChange={(e) => set('species', e.target.value)}
        style={{
          padding: '0.4rem 0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: 4,
          fontSize: 13,
          width: '100%',
        }}
      >
        <option value="">{t('species.all')}</option>
        {species.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name.en} / {s.name.fr}
          </option>
        ))}
      </select>
    </div>
  );
}
