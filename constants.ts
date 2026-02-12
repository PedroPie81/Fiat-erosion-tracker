
import { Region, InflationData } from './types';

export const REGION_CONFIG: Record<Region, InflationData> = {
  [Region.US]: {
    region: Region.US,
    currency: 'USD',
    officialRate: 0.031, // Placeholder 3.1%
    alternativeRate: 0.089, // ShadowStats proxy
    symbol: '$',
    lastUpdated: 'Dec 2024',
    isFallback: false
  },
  [Region.UK]: {
    region: Region.UK,
    currency: 'GBP',
    officialRate: 0.034, // Updated to Dec 2025 rate
    alternativeRate: 0.095, // ShadowStats-inspired approximation
    symbol: '£',
    lastUpdated: 'December 2025 (API Retired)',
    isFallback: true
  },
  [Region.EUROZONE]: {
    region: Region.EUROZONE,
    currency: 'EUR',
    officialRate: 0.024, // HICP approx
    alternativeRate: 0.075,
    symbol: '€',
    lastUpdated: 'Dec 2024',
    isFallback: false
  }
};

export const SECONDS_IN_YEAR = 31536000;
