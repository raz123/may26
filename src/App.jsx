import { useState, useEffect, useMemo } from 'react';
import { I18nProvider, useTranslation } from './i18n/useTranslation';
import { useGeolocation, haversineDistance } from './hooks/useGeolocation';
import Header from './components/Header';
import MapView from './components/MapView';
import SpotList from './components/SpotList';
import SpotDetail from './components/SpotDetail';
import FilterBar from './components/FilterBar';

import spotsData from './data/spots.json';
import speciesData from './data/species.json';
import equipmentData from './data/equipment.json';

function AppInner() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [filters, setFilters] = useState({ type: '', region: '', species: '', search: '' });
  const { location: userLocation, loading: geoLoading, requestLocation } = useGeolocation();
  const { t } = useTranslation();

  const filteredSpots = useMemo(() => {
    let result = spotsData;

    if (filters.type) {
      result = result.filter((s) => s.type === filters.type);
    }

    if (filters.region) {
      result = result.filter((s) => s.region === filters.region);
    }

    if (filters.species) {
      const fid = parseInt(filters.species, 10);
      result = result.filter((s) => s.fish.includes(fid));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.en.toLowerCase().includes(q) ||
          s.name.fr.toLowerCase().includes(q) ||
          s.region.toLowerCase().includes(q) ||
          s.description.en.toLowerCase().includes(q)
      );
    }

    return result;
  }, [filters]);

  const sortedSpots = useMemo(() => {
    if (!userLocation) return filteredSpots;
    return [...filteredSpots].sort((a, b) => {
      const dA = haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const dB = haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return dA - dB;
    });
  }, [filteredSpots, userLocation]);

  useEffect(() => {
    if (!selectedSpot && sortedSpots.length > 0) {
      setSelectedSpot(sortedSpots[0]);
    }
  }, [sortedSpots, selectedSpot]);

  const handleNearMe = () => requestLocation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--color-background)' }}>
      <Header onNearMe={handleNearMe} userLocation={userLocation} loading={geoLoading} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar */}
        <div style={{
          width: 340,
          minWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}>
          <FilterBar filters={filters} onChange={setFilters} species={speciesData} />

          <div style={{
            padding: '0.5rem 1rem',
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-background)',
          }}>
            {sortedSpots.length} spot{sortedSpots.length !== 1 ? 's' : ''}
            {userLocation ? ' — sorted by distance' : ''}
          </div>

          <SpotList
            spots={sortedSpots}
            selected={selectedSpot}
            onSelect={setSelectedSpot}
            userLocation={userLocation}
            species={speciesData}
          />
        </div>

        {/* Main area: map + detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MapView
              spots={sortedSpots}
              selectedSpot={selectedSpot}
              onSelectSpot={setSelectedSpot}
              userLocation={userLocation}
            />
          </div>

          {selectedSpot && (
            <div style={{
              maxHeight: '45%',
              overflowY: 'auto',
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}>
              <SpotDetail
                spot={selectedSpot}
                species={speciesData}
                equipment={equipmentData}
              />
            </div>
          )}

          {!selectedSpot && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: 14,
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}>
              {t('spot.noSelection')}
            </div>
          )}
        </div>
      </div>

      {/* Affiliate disclosure */}
      <div style={{
        padding: '0.4rem 1rem',
        fontSize: 10,
        color: 'var(--color-text-secondary)',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        {t('disclosure')}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
