
import { Region, InflationData, HistoricalPoint, ProjectionBasis } from '../types';
import { REGION_CONFIG } from '../constants';

export const fetchInflationData = async (region: Region, altMultiplier: number = 2.8): Promise<InflationData> => {
  const config = { ...REGION_CONFIG[region] };
  
  try {
    // ONS legacy API (v0) was retired on 25/11/2024. 
    // We now rely on hardcoded bulletin data for the UK until v1 integration is complete.
    if (region === Region.UK) {
      return {
        ...config,
        officialRate: 0.034, // Latest published rate: 3.4% (Dec 2025)
        alternativeRate: 0.034 * altMultiplier,
        lastUpdated: 'December 2025 (ONS legacy API retired)',
        isFallback: true
      };
    }

    // Placeholder for other regions if APIs were available
    return {
      ...config,
      alternativeRate: config.officialRate * altMultiplier,
      isFallback: true
    };
  } catch (error) {
    console.warn("Fetch failed, using fallback constants", error);
    return {
      ...config,
      alternativeRate: config.officialRate * altMultiplier,
      isFallback: true
    };
  }
};

/**
 * Helper to determine rates used for future projection based on mode.
 * In a real app, TREND would be calculated from a fetched historical array.
 * Here we simulate it with a distinct multiplier for clear visual feedback.
 */
export const getProjectedRates = (regionData: InflationData, basis: ProjectionBasis) => {
  if (basis === ProjectionBasis.CONSTANT) {
    return {
      official: regionData.officialRate,
      alternative: regionData.alternativeRate
    };
  }
  // TREND: Simulate a 5-year average lookback. 
  // Given recent inflation spikes (2022-2024), the historical trend is generally higher than the current "cooling" rate.
  return {
    official: regionData.officialRate * 1.35, // e.g., 3.4% -> 4.6%
    alternative: regionData.alternativeRate * 1.20 // e.g., 9.5% -> 11.4%
  };
};

export const generateFullSeries = (
  amount: number,
  pastYears: number,
  futureYears: number,
  regionData: InflationData,
  basis: ProjectionBasis
): HistoricalPoint[] => {
  const points: HistoricalPoint[] = [];
  const currentYear = new Date().getFullYear();
  
  // 1. Calculate historical points
  // We represent "Purchasing Power" of the nominal 'amount' in previous years.
  // 100k today was equivalent to more goods in the past.
  for (let i = pastYears; i >= 0; i--) {
    const year = currentYear - i;
    // Mathematically: ValueInPast = ValueToday * (1 + rate)^yearsBack
    const officialPower = amount * Math.pow(1 + regionData.officialRate, i);
    const alternativePower = amount * Math.pow(1 + regionData.alternativeRate, i);
    
    points.push({
      year,
      nominal: amount,
      realOfficial: officialPower,
      realAlternative: alternativePower,
      realOfficialProjected: i === 0 ? officialPower : null,
      realAlternativeProjected: i === 0 ? alternativePower : null,
      isFuture: false
    });
  }

  // 2. Projection logic
  const rates = getProjectedRates(regionData, basis);

  for (let i = 1; i <= futureYears; i++) {
    const year = currentYear + i;
    // Mathematically: ValueInFuture = ValueToday / (1 + rate)^yearsForward
    const officialProj = amount / Math.pow(1 + rates.official, i);
    const alternativeProj = amount / Math.pow(1 + rates.alternative, i);

    points.push({
      year,
      nominal: amount,
      realOfficial: null,
      realAlternative: null,
      realOfficialProjected: officialProj,
      realAlternativeProjected: alternativeProj,
      isFuture: true
    });
  }
  
  return points;
};
