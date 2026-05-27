import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { haversineDistance } from '../hooks/useGeolocation';
import CompactEquipmentCard from './CompactEquipmentCard';

function getSeason(month) {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

function getPeriod(hour) {
  if (hour >= 4 && hour <= 6) return 'dawn';
  if (hour >= 7 && hour <= 10) return 'morning';
  if (hour >= 11 && hour <= 12) return 'midday';
  if (hour >= 13 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 19) return 'dusk';
  return 'night';
}

const PERIOD_EMOJI = {
  dawn: '🌅', morning: '☀️', midday: '☀️',
  afternoon: '🌤️', dusk: '🌆', night: '🌙',
};

const PERIOD_LABELS = {
  en: { dawn: 'Dawn', morning: 'Morning', midday: 'Midday', afternoon: 'Afternoon', dusk: 'Dusk', night: 'Night' },
  fr: { dawn: 'Aube', morning: 'Matin', midday: 'Midi', afternoon: 'Après-midi', dusk: 'Crépuscule', night: 'Nuit' },
};

const SEASON_LABELS = {
  en: { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' },
  fr: { spring: 'Printemps', summer: 'Été', fall: 'Automne', winter: 'Hiver' },
};

export default function HereAndNowPanel({ spots, species, equipment, userLocation, onClose, onSelectSpot }) {
  const { t, lang, localized } = useTranslation();
  const now = new Date();
  const currentSeason = getSeason(now.getMonth());
  const currentPeriod = getPeriod(now.getHours());

  const nowInfo = useMemo(() => {
    const season = getSeason(now.getMonth());
    const period = getPeriod(now.getHours());
    const hourStr = now.toLocaleTimeString(lang === 'fr' ? 'fr-CA' : 'en-CA', { hour: '2-digit', minute: '2-digit' });
    return { season, period, hourStr };
  }, [now, lang]);

  // Build species lookup
  const speciesById = useMemo(() => {
    const map = {};
    species.forEach((s) => { map[s.id] = s; });
    return map;
  }, [species]);

  // Compute active species (match season + period)
  const activeSpecies = useMemo(() => {
    return species.filter((s) => {
      const seasonOk = s.seasons && s.seasons.includes(currentSeason);
      const periodOk = s.bestPeriods && s.bestPeriods.includes(currentPeriod);
      return seasonOk && periodOk;
    });
  }, [species, currentSeason, currentPeriod]);

  // Score spots
  const scoredSpots = useMemo(() => {
    if (!userLocation) return [];

    // Max distance for normalization
    let maxDist = 0;
    const distances = spots.map((spot) => {
      const d = haversineDistance(userLocation.lat, userLocation.lng, spot.lat, spot.lng);
      if (d > maxDist) maxDist = d;
      return { spot, dist: d };
    });
    if (maxDist === 0) maxDist = 1;

    return distances
      .map(({ spot, dist }) => {
        const totalFish = spot.fish.length;
        if (totalFish === 0) return { spot, dist, score: 0 };

        let seasonMatch = 0;
        let periodMatch = 0;

        spot.fish.forEach((fid) => {
          const f = speciesById[fid];
          if (!f) return;
          if (f.seasons && f.seasons.includes(currentSeason)) seasonMatch++;
          if (f.bestPeriods && f.bestPeriods.includes(currentPeriod)) periodMatch++;
        });

        const seasonPct = seasonMatch / totalFish;
        const periodPct = periodMatch / totalFish;
        const invDist = 1 - dist / maxDist;

        return {
          spot,
          dist,
          score: seasonPct * 0.6 + periodPct * 0.3 + invDist * 0.1,
          seasonMatch,
          periodMatch,
          totalFish,
        };
      })
      .filter((s) => s.seasonMatch > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [spots, speciesById, userLocation, currentSeason, currentPeriod]);

  // Gear for active species
  const gearForToday = useMemo(() => {
    const activeIds = new Set(activeSpecies.map((s) => s.id));
    return equipment.filter((eq) => eq.targetFish.some((fid) => activeIds.has(fid)));
  }, [equipment, activeSpecies]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: 560,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
              {t('hereAndNow.title')}
            </h2>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {nowInfo.hourStr} — {SEASON_LABELS[lang][nowInfo.season]}
              {' · '}{PERIOD_EMOJI[nowInfo.period]} {PERIOD_LABELS[lang][nowInfo.period]}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              padding: '0.25rem',
              lineHeight: 1,
            }}
            aria-label={t('hereAndNow.close')}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1rem 1.25rem' }}>
          {/* Section 1: What's biting now */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
              🎯 {t('hereAndNow.whatsBiting')}
            </h3>
            {activeSpecies.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                {t('hereAndNow.nothingBiting')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeSpecies.map((f) => (
                  <span key={f.id} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    background: '#f0fdf4',
                    borderRadius: '20px',
                    border: '1px solid #bbf7d0',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}>
                    {f.emoji} {localized(f.name)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Top spots nearby */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
              📍 {t('hereAndNow.topSpots')}
            </h3>
            {!userLocation ? (
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                {t('hereAndNow.needLocation')}
              </div>
            ) : scoredSpots.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                {t('hereAndNow.noSpots')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {scoredSpots.map((item, idx) => {
                  const pct = Math.round(item.score * 100);
                  return (
                    <div
                      key={item.spot.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => { onSelectSpot(item.spot); onClose(); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { onSelectSpot(item.spot); onClose(); }}}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        background: '#f9fafb',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f0fdf4';
                        e.currentTarget.style.borderColor = '#bbf7d0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.borderColor = 'var(--color-border)';
                      }}
                    >
                      <span style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: pct > 80 ? '#22c55e' : pct > 50 ? '#eab308' : '#6b7280',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {idx + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                          {localized(item.spot.name)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                          {item.spot.region} · {Math.round(item.dist)} km
                          {item.seasonMatch !== item.totalFish && (
                            <span> · {item.seasonMatch}/{item.totalFish} {t('hereAndNow.fishActive')}</span>
                          )}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: pct > 80 ? '#16a34a' : pct > 50 ? '#ca8a04' : '#6b7280',
                        whiteSpace: 'nowrap',
                      }}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Gear for today */}
          {gearForToday.length > 0 && (
            <div>
              <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                🎣 {t('hereAndNow.gearToday')}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
              }}>
                {gearForToday.map((eq) => (
                  <CompactEquipmentCard key={eq.id} item={eq} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
