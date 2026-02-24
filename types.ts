
export type Currency = 'GBP' | 'USD' | 'EUR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  officialRate: number; // Annual %
  altRate: number;      // Annual %
  officialSource: string;
  altDescription: string;
}
