export type Currency = 'GBP' | 'USD' | 'EUR';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  officialRate: number;
  altRate: number;
  officialSource: string;
  altDescription: string;
}
