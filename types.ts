
export enum Region {
  US = 'US',
  UK = 'UK',
  EUROZONE = 'EUROZONE'
}

export enum ProjectionBasis {
  CONSTANT = 'CONSTANT',
  TREND = 'TREND'
}

export interface InflationData {
  region: Region;
  currency: string;
  officialRate: number;
  alternativeRate: number;
  symbol: string;
  lastUpdated: string;
  isFallback?: boolean;
}

export interface HistoricalPoint {
  year: number;
  nominal: number;
  realOfficial: number | null;
  realAlternative: number | null;
  realOfficialProjected: number | null;
  realAlternativeProjected: number | null;
  isFuture: boolean;
}

export interface BtcPoint {
  timestamp: number;
  dateLabel: string;
  price: number;
  value: number; // The value of the user's 'savings' if invested then
}
