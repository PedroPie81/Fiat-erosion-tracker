export interface EraWageData {
  year: number;
  label: string;
  medianAnnualWage: number;
  averageHourlyWage: number;
  minimumWageHourly: number;
}

export interface HistoricalCostItem {
  id: string;
  name: string;
  category: 'housing' | 'education_health' | 'transport_energy' | 'food_staples' | 'sound_assets';
  categoryLabel: string;
  iconName: string;
  unit: string;
  description: string;
  // Prices by year in native currency
  prices: Record<number, number>;
  notes?: string;
}

export interface CurrencyDataset {
  currencyCode: 'USD' | 'GBP' | 'EUR';
  symbol: string;
  name: string;
  sources: string[];
  wages: Record<number, EraWageData>;
  items: HistoricalCostItem[];
}

export const YEARS_LIST = [1971, 1980, 1990, 2000, 2010, 2020, 2026] as const;
export type SupportedYear = typeof YEARS_LIST[number];

export const COST_VS_WAGES_DATA: Record<'USD' | 'GBP' | 'EUR', CurrencyDataset> = {
  USD: {
    currencyCode: 'USD',
    symbol: '$',
    name: 'United States Dollar (USD)',
    sources: [
      'US Bureau of Labor Statistics (BLS - CPS/CES Average Hourly Earnings)',
      'US Census Bureau & HUD (Historical Median Sales Price of Houses Sold)',
      'Federal Reserve Bank of St. Louis (FRED)',
      'National Center for Education Statistics (NCES - Digest of Education Statistics)',
      'US Energy Information Administration (EIA - Historical Retail Gasoline & Electricity)'
    ],
    wages: {
      1971: { year: 1971, label: '1971 (Nixon Shock)', medianAnnualWage: 9430, averageHourlyWage: 3.63, minimumWageHourly: 1.60 },
      1980: { year: 1980, label: '1980 (Volcker Era)', medianAnnualWage: 19500, averageHourlyWage: 6.84, minimumWageHourly: 3.10 },
      1990: { year: 1990, label: '1990', medianAnnualWage: 31200, averageHourlyWage: 10.01, minimumWageHourly: 3.80 },
      2000: { year: 2000, label: '2000 (Dot-Com Peak)', medianAnnualWage: 42150, averageHourlyWage: 14.00, minimumWageHourly: 5.15 },
      2010: { year: 2010, label: '2010 (Post-GFC / ZIRP)', medianAnnualWage: 49400, averageHourlyWage: 19.07, minimumWageHourly: 7.25 },
      2020: { year: 2020, label: '2020 (Pre-Stimulus)', medianAnnualWage: 63200, averageHourlyWage: 24.80, minimumWageHourly: 7.25 },
      2026: { year: 2026, label: '2026 (Present Day)', medianAnnualWage: 76500, averageHourlyWage: 31.20, minimumWageHourly: 7.25 }
    },
    items: [
      {
        id: 'median_home',
        name: 'Median Single-Family Home',
        category: 'housing',
        categoryLabel: 'Housing & Shelter',
        iconName: 'Home',
        unit: 'per home',
        description: 'Median sales price of new & existing single-family homes in the United States.',
        prices: {
          1971: 25200,
          1980: 64600,
          1990: 122900,
          2000: 169000,
          2010: 221800,
          2020: 336900,
          2026: 432000
        },
        notes: 'Price-to-income ratio rose from ~2.7x in 1971 to over 5.6x in 2026.'
      },
      {
        id: 'monthly_rent',
        name: 'Average Monthly Rent (2-Bed)',
        category: 'housing',
        categoryLabel: 'Housing & Shelter',
        iconName: 'Building',
        unit: 'per month',
        description: 'Median monthly apartment rent across metropolitan areas.',
        prices: {
          1971: 108,
          1980: 243,
          1990: 485,
          2000: 675,
          2010: 920,
          2020: 1465,
          2026: 1980
        },
        notes: 'Monthly rent went from ~30 hours of labor in 1971 to ~63.5 hours today.'
      },
      {
        id: 'college_tuition',
        name: '1-Year University Tuition & Fees',
        category: 'education_health',
        categoryLabel: 'Education & Healthcare',
        iconName: 'GraduationCap',
        unit: 'per academic year',
        description: 'Average annual undergraduate tuition, fees, room & board (4-year college average).',
        prices: {
          1971: 1410,
          1980: 3101,
          1990: 7602,
          2000: 14200,
          2010: 22000,
          2020: 30500,
          2026: 39500
        },
        notes: 'College costs outpaced general CPI inflation by over 400% due to federally guaranteed student debt expansion.'
      },
      {
        id: 'health_insurance_family',
        name: 'Annual Family Health Coverage',
        category: 'education_health',
        categoryLabel: 'Education & Healthcare',
        iconName: 'HeartPulse',
        unit: 'per year (total premium)',
        description: 'Average annual total employer-sponsored family healthcare premium and deductibles.',
        prices: {
          1971: 420,
          1980: 1150,
          1990: 3160,
          2000: 6438,
          2010: 13770,
          2020: 21342,
          2026: 26800
        },
        notes: 'Healthcare costs exploded from 4.4% of median annual wage to ~35% of median annual wage.'
      },
      {
        id: 'new_car',
        name: 'Average New Passenger Vehicle',
        category: 'transport_energy',
        categoryLabel: 'Transportation & Energy',
        iconName: 'Car',
        unit: 'per vehicle',
        description: 'Average transaction price for a new consumer automobile / light truck.',
        prices: {
          1971: 3740,
          1980: 7570,
          1990: 15400,
          2000: 21850,
          2010: 29217,
          2020: 38723,
          2026: 48500
        },
        notes: 'Automotive financing expanded from 36-month terms in the 1970s to 72-84 months today to mask price inflation.'
      },
      {
        id: 'gasoline_gallon',
        name: 'Gallon of Regular Gasoline',
        category: 'transport_energy',
        categoryLabel: 'Transportation & Energy',
        iconName: 'Fuel',
        unit: 'per gallon (3.78L)',
        description: 'National retail pump price for regular unleaded gasoline.',
        prices: {
          1971: 0.36,
          1980: 1.19,
          1990: 1.16,
          2000: 1.51,
          2010: 2.79,
          2020: 2.17,
          2026: 3.55
        },
        notes: 'In 1971, 1 hour of labor bought 10.1 gallons. Today 1 hour buys 8.8 gallons.'
      },
      {
        id: 'dozen_eggs',
        name: 'Dozen Grade A Large Eggs',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Egg',
        unit: 'per dozen (12 eggs)',
        description: 'BLS average retail price for a dozen Grade A large eggs.',
        prices: {
          1971: 0.53,
          1980: 0.84,
          1990: 1.00,
          2000: 0.91,
          2010: 1.47,
          2020: 1.51,
          2026: 3.45
        },
        notes: 'Industrial battery farming reduced egg labor from 8.8 mins in 1971 to 3.7 mins in 2020. Severe post-2020 feed/flock inflation pushed it back to 6.6 mins.'
      },
      {
        id: 'loaf_bread',
        name: 'Loaf of Fresh White Bread (1 lb)',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Wheat',
        unit: 'per 1 lb (454g) loaf',
        description: 'BLS average consumer price for 1 pound of white pan bread.',
        prices: {
          1971: 0.25,
          1980: 0.50,
          1990: 0.70,
          2000: 0.93,
          2010: 1.39,
          2020: 1.52,
          2026: 2.10
        },
        notes: 'Mechanized wheat harvesting and bakeries dropped bread labor from 4.1 mins in 1971 to ~3.7 mins in 2020, rising to 4.0 mins today.'
      },
      {
        id: 'gallon_milk',
        name: 'Gallon of Fresh Whole Milk',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Milk',
        unit: 'per gallon',
        description: 'BLS average consumer price for one gallon whole fresh milk.',
        prices: {
          1971: 1.18,
          1980: 2.16,
          1990: 2.78,
          2000: 2.79,
          2010: 3.32,
          2020: 3.39,
          2026: 4.35
        },
        notes: 'Automated milking and massive dairy subsidies halved milk labor from 19.5 mins in 1971 to 8.4 mins in 2026.'
      },
      {
        id: 'beef_ground',
        name: '1 lb Ground Beef (100% Beef)',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Beef',
        unit: 'per lb',
        description: 'BLS retail price for 1 lb ground chuck/beef.',
        prices: {
          1971: 0.70,
          1980: 1.86,
          1990: 1.63,
          2000: 1.63,
          2010: 2.54,
          2020: 4.12,
          2026: 5.85
        },
        notes: 'Took 11.6 mins of labor in 1971, dropped to 7.0 mins in 2000 due to feedlot scaling, then rebounded to 11.3 mins by 2026 due to feed & energy costs.'
      },
      {
        id: 'gold_ounce',
        name: '1 Troy Ounce of Physical Gold',
        category: 'sound_assets',
        categoryLabel: 'Sound Assets vs. Fiat',
        iconName: 'Shield',
        unit: 'per troy oz (31.1g)',
        description: 'Global spot price of 1 troy ounce of fine gold (99.9%).',
        prices: {
          1971: 35,
          1980: 615,
          1990: 383,
          2000: 279,
          2010: 1225,
          2020: 1770,
          2026: 2900
        },
        notes: 'In 1971, it took just 9.6 hours of average labor to buy an ounce of gold. Today it takes ~93 hours.'
      },
      {
        id: 'bitcoin_unit',
        name: '1 Bitcoin (BTC)',
        category: 'sound_assets',
        categoryLabel: 'Sound Assets vs. Fiat',
        iconName: 'Coins',
        unit: 'per 1 BTC (100M sats)',
        description: 'Spot price of 1 whole Bitcoin on open global exchanges.',
        prices: {
          1971: 0,
          1980: 0,
          1990: 0,
          2000: 0,
          2010: 0.15,
          2020: 10500,
          2026: 95000
        },
        notes: 'In 2010, 1 hour of labor bought over 120 Bitcoins. Today 1 Bitcoin requires ~3,045 hours of labor.'
      }
    ]
  },
  GBP: {
    currencyCode: 'GBP',
    symbol: '£',
    name: 'British Pound Sterling (GBP)',
    sources: [
      'UK Office for National Statistics (ONS - Average Weekly Earnings & ASHE)',
      'Nationwide House Price Index (Historical UK Property Series since 1952)',
      'Bank of England (A Millennium of Macroeconomic Data)',
      'House of Commons Library (Historical Tuition Fees & Cost of Living Series)',
      'UK Department for Energy Security and Net Zero'
    ],
    wages: {
      1971: { year: 1971, label: '1971 (Decades of Debasement)', medianAnnualWage: 1650, averageHourlyWage: 0.82, minimumWageHourly: 0.40 },
      1980: { year: 1980, label: '1980 (Thatcher Era)', medianAnnualWage: 6000, averageHourlyWage: 3.00, minimumWageHourly: 1.40 },
      1990: { year: 1990, label: '1990 (ERM Period)', medianAnnualWage: 13700, averageHourlyWage: 6.85, minimumWageHourly: 3.10 },
      2000: { year: 2000, label: '2000 (New Labour)', medianAnnualWage: 20500, averageHourlyWage: 10.25, minimumWageHourly: 3.70 },
      2010: { year: 2010, label: '2010 (Austerity Era)', medianAnnualWage: 25900, averageHourlyWage: 13.28, minimumWageHourly: 5.93 },
      2020: { year: 2020, label: '2020 (Pre-Pandemic)', medianAnnualWage: 31400, averageHourlyWage: 16.10, minimumWageHourly: 8.72 },
      2026: { year: 2026, label: '2026 (Present Day)', medianAnnualWage: 38500, averageHourlyWage: 19.75, minimumWageHourly: 11.44 }
    },
    items: [
      {
        id: 'median_home',
        name: 'Average UK Residential Property',
        category: 'housing',
        categoryLabel: 'Housing & Shelter',
        iconName: 'Home',
        unit: 'per house',
        description: 'Nationwide / ONS average UK residential property transaction price.',
        prices: {
          1971: 5630,
          1980: 23600,
          1990: 59780,
          2000: 89600,
          2010: 170400,
          2020: 242000,
          2026: 295000
        },
        notes: 'Average house was 3.4x average earnings in 1971, reaching over 7.6x in 2026.'
      },
      {
        id: 'monthly_rent',
        name: 'Average Monthly Private Rent',
        category: 'housing',
        categoryLabel: 'Housing & Shelter',
        iconName: 'Building',
        unit: 'per month',
        description: 'Average monthly private rental cost across England and Wales.',
        prices: {
          1971: 22,
          1980: 85,
          1990: 240,
          2000: 450,
          2010: 680,
          2020: 980,
          2026: 1350
        },
        notes: 'Monthly rent increased from ~27 hours of labor in 1971 to over 68.3 hours today.'
      },
      {
        id: 'college_tuition',
        name: 'Annual Undergraduate University Tuition',
        category: 'education_health',
        categoryLabel: 'Education & Healthcare',
        iconName: 'GraduationCap',
        unit: 'per academic year',
        description: 'Average tuition fee for UK domestic undergraduate students.',
        prices: {
          1971: 0,
          1980: 0,
          1990: 0,
          2000: 1025,
          2010: 3290,
          2020: 9250,
          2026: 9535
        },
        notes: 'UK higher education was completely free with maintenance grants until tuition was introduced in 1998.'
      },
      {
        id: 'health_insurance_family',
        name: 'Private Health / Dental & Care (Annual)',
        category: 'education_health',
        categoryLabel: 'Education & Healthcare',
        iconName: 'HeartPulse',
        unit: 'per year',
        description: 'Average annual private family medical insurance & supplemental dental/prescription spending.',
        prices: {
          1971: 45,
          1980: 190,
          1990: 520,
          2000: 980,
          2010: 1650,
          2020: 2450,
          2026: 3200
        }
      },
      {
        id: 'new_car',
        name: 'Average New Family Car (Ford Escort / Focus)',
        category: 'transport_energy',
        categoryLabel: 'Transportation & Energy',
        iconName: 'Car',
        unit: 'per car',
        description: 'Typical UK family hatchback retail purchase price.',
        prices: {
          1971: 950,
          1980: 3450,
          1990: 8900,
          2000: 12500,
          2010: 17200,
          2020: 23500,
          2026: 29800
        }
      },
      {
        id: 'gasoline_gallon',
        name: 'Litre of Petrol (Gasoline)',
        category: 'transport_energy',
        categoryLabel: 'Transportation & Energy',
        iconName: 'Fuel',
        unit: 'per litre',
        description: 'UK retail average price per litre of standard unleaded petrol.',
        prices: {
          1971: 0.08,
          1980: 0.28,
          1990: 0.44,
          2000: 0.77,
          2010: 1.18,
          2020: 1.14,
          2026: 1.48
        }
      },
      {
        id: 'dozen_eggs',
        name: 'Dozen Free Range Eggs',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Egg',
        unit: 'per 12 eggs',
        description: 'ONS average retail price for 12 large eggs.',
        prices: {
          1971: 0.23,
          1980: 0.65,
          1990: 1.12,
          2000: 1.30,
          2010: 2.10,
          2020: 2.05,
          2026: 3.40
        }
      },
      {
        id: 'loaf_bread',
        name: 'Large Sliced White Loaf (800g)',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Wheat',
        unit: 'per 800g loaf',
        description: 'ONS average consumer price for an 800g loaf of white bread.',
        prices: {
          1971: 0.10,
          1980: 0.33,
          1990: 0.50,
          2000: 0.55,
          2010: 1.18,
          2020: 1.08,
          2026: 1.55
        }
      },
      {
        id: 'gallon_milk',
        name: '4 Pints of Fresh Whole Milk (2.27L)',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Milk',
        unit: 'per 4 pints',
        description: 'ONS average retail price for a 4-pint supermarket bottle of whole milk.',
        prices: {
          1971: 0.21,
          1980: 0.64,
          1990: 1.08,
          2000: 1.05,
          2010: 1.45,
          2020: 1.15,
          2026: 1.65
        }
      },
      {
        id: 'beef_ground',
        name: '1 kg Minced Beef (Fresh)',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Beef',
        unit: 'per kg',
        description: 'Average supermarket price for 1 kg of fresh minced beef.',
        prices: {
          1971: 0.55,
          1980: 2.10,
          1990: 3.40,
          2000: 3.90,
          2010: 5.60,
          2020: 6.80,
          2026: 9.90
        },
        notes: 'Took ~40 mins of UK work in 1971, dropped to 23 mins in 2000 with industrial supply chains, and rose back to 30 mins in 2026.'
      },
      {
        id: 'gold_ounce',
        name: '1 Troy Ounce of Physical Gold (XAU)',
        category: 'sound_assets',
        categoryLabel: 'Sound Assets vs. Fiat',
        iconName: 'Shield',
        unit: 'per troy oz (31.1g)',
        description: 'Spot price of 1 troy ounce of gold converted to GBP.',
        prices: {
          1971: 14.5,
          1980: 265,
          1990: 215,
          2000: 185,
          2010: 790,
          2020: 1380,
          2026: 2320
        },
        notes: 'In 1971, an ounce of gold cost ~17.6 hours of UK labor. Today it requires ~117.5 hours.'
      },
      {
        id: 'bitcoin_unit',
        name: '1 Bitcoin (BTC)',
        category: 'sound_assets',
        categoryLabel: 'Sound Assets vs. Fiat',
        iconName: 'Coins',
        unit: 'per 1 BTC',
        description: 'Spot market price of 1 Bitcoin in GBP.',
        prices: {
          1971: 0,
          1980: 0,
          1990: 0,
          2000: 0,
          2010: 0.10,
          2020: 8200,
          2026: 76000
        },
        notes: 'Requires over 3,848 hours of average UK work to accumulate 1 Bitcoin today.'
      }
    ]
  },
  EUR: {
    currencyCode: 'EUR',
    symbol: '€',
    name: 'Euro (EUR - Blended Eurozone Synthetic Series)',
    sources: [
      'Eurostat (Historical Harmonised Index of Consumer Prices & Labour Cost Index)',
      'Deutsche Bundesbank & Banque de France (Historical Pre-Euro Converted Series)',
      'European Central Bank (ECB Statistical Data Warehouse)',
      'OECD Economic Outlook & Historical Wage Series'
    ],
    wages: {
      1971: { year: 1971, label: '1971 (Pre-Euro Synthetic)', medianAnnualWage: 1850, averageHourlyWage: 0.92, minimumWageHourly: 0.45 },
      1980: { year: 1980, label: '1980', medianAnnualWage: 7400, averageHourlyWage: 3.70, minimumWageHourly: 1.80 },
      1990: { year: 1990, label: '1990', medianAnnualWage: 16200, averageHourlyWage: 8.10, minimumWageHourly: 3.90 },
      2000: { year: 2000, label: '2000 (Euro Launch Era)', medianAnnualWage: 23400, averageHourlyWage: 11.70, minimumWageHourly: 5.50 },
      2010: { year: 2010, label: '2010 (Sovereign Debt Crisis)', medianAnnualWage: 30100, averageHourlyWage: 15.05, minimumWageHourly: 7.50 },
      2020: { year: 2020, label: '2020 (Pre-Pandemic)', medianAnnualWage: 36200, averageHourlyWage: 18.10, minimumWageHourly: 9.35 },
      2026: { year: 2026, label: '2026 (Present Day)', medianAnnualWage: 43500, averageHourlyWage: 21.75, minimumWageHourly: 12.41 }
    },
    items: [
      {
        id: 'median_home',
        name: 'Average Eurozone Residential Dwelling',
        category: 'housing',
        categoryLabel: 'Housing & Shelter',
        iconName: 'Home',
        unit: 'per dwelling',
        description: 'Eurostat / ECB aggregate residential property price index converted to EUR equivalent.',
        prices: {
          1971: 7200,
          1980: 31000,
          1990: 74000,
          2000: 115000,
          2010: 188000,
          2020: 265000,
          2026: 335000
        },
        notes: 'Price-to-wage ratio expanded from 3.9x in 1971 to 7.7x today.'
      },
      {
        id: 'monthly_rent',
        name: 'Average Monthly Apartment Rent',
        category: 'housing',
        categoryLabel: 'Housing & Shelter',
        iconName: 'Building',
        unit: 'per month',
        description: 'Average monthly rent for standard 2-bedroom urban apartment.',
        prices: {
          1971: 28,
          1980: 110,
          1990: 290,
          2000: 510,
          2010: 720,
          2020: 1020,
          2026: 1420
        },
        notes: 'Labor hours needed for monthly rent increased from 30.4 hours in 1971 to 65.3 hours in 2026.'
      },
      {
        id: 'college_tuition',
        name: 'Annual Higher Education & Fees (Eurozone Avg)',
        category: 'education_health',
        categoryLabel: 'Education & Healthcare',
        iconName: 'GraduationCap',
        unit: 'per academic year',
        description: 'Average public and private administrative student fees and academic materials.',
        prices: {
          1971: 120,
          1980: 380,
          1990: 750,
          2000: 1200,
          2010: 1850,
          2020: 2600,
          2026: 3450
        }
      },
      {
        id: 'health_insurance_family',
        name: 'Statutory & Private Health Contribution (Annual)',
        category: 'education_health',
        categoryLabel: 'Education & Healthcare',
        iconName: 'HeartPulse',
        unit: 'per year',
        description: 'Blended average employee healthcare contributions and out-of-pocket medical co-pays.',
        prices: {
          1971: 95,
          1980: 420,
          1990: 1150,
          2000: 2100,
          2010: 3400,
          2020: 4600,
          2026: 5900
        }
      },
      {
        id: 'new_car',
        name: 'Average Compact Passenger Car (VW Golf Class)',
        category: 'transport_energy',
        categoryLabel: 'Transportation & Energy',
        iconName: 'Car',
        unit: 'per car',
        description: 'Standard German/French manufactured compact vehicle price.',
        prices: {
          1971: 1250,
          1980: 4300,
          1990: 10500,
          2000: 15400,
          2010: 21200,
          2020: 27900,
          2026: 35200
        }
      },
      {
        id: 'gasoline_gallon',
        name: 'Litre of Euro Super 95 Gasoline',
        category: 'transport_energy',
        categoryLabel: 'Transportation & Energy',
        iconName: 'Fuel',
        unit: 'per litre',
        description: 'Blended Eurozone pump price for unleaded super petrol.',
        prices: {
          1971: 0.11,
          1980: 0.38,
          1990: 0.62,
          2000: 0.98,
          2010: 1.39,
          2020: 1.35,
          2026: 1.82
        }
      },
      {
        id: 'dozen_eggs',
        name: 'Pack of 10-12 Fresh Organic/Cage-Free Eggs',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Egg',
        unit: 'per dozen eggs',
        description: 'Eurostat average consumer price index for fresh hen eggs.',
        prices: {
          1971: 0.28,
          1980: 0.85,
          1990: 1.35,
          2000: 1.45,
          2010: 2.25,
          2020: 2.40,
          2026: 3.85
        }
      },
      {
        id: 'loaf_bread',
        name: 'Loaf of Fresh Bread (1 kg)',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Wheat',
        unit: 'per 1 kg loaf',
        description: 'Eurostat average price for 1 kg fresh artisanal white/rye bread.',
        prices: {
          1971: 0.18,
          1980: 0.55,
          1990: 1.10,
          2000: 1.40,
          2010: 2.15,
          2020: 2.45,
          2026: 3.50
        }
      },
      {
        id: 'gallon_milk',
        name: '1 Litre Fresh Whole Milk',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Milk',
        unit: 'per 1 litre',
        description: 'Average supermarket price for 1 litre pasteurised whole milk.',
        prices: {
          1971: 0.12,
          1980: 0.35,
          1990: 0.60,
          2000: 0.68,
          2010: 0.89,
          2020: 0.98,
          2026: 1.45
        }
      },
      {
        id: 'beef_ground',
        name: '1 kg Fresh Minced Beef',
        category: 'food_staples',
        categoryLabel: 'Food & Groceries',
        iconName: 'Beef',
        unit: 'per kg',
        description: 'Eurostat average consumer price for 1 kg fresh beef.',
        prices: {
          1971: 0.85,
          1980: 2.90,
          1990: 5.20,
          2000: 6.10,
          2010: 7.90,
          2020: 9.80,
          2026: 13.50
        }
      },
      {
        id: 'gold_ounce',
        name: '1 Troy Ounce of Physical Gold (EUR)',
        category: 'sound_assets',
        categoryLabel: 'Sound Assets vs. Fiat',
        iconName: 'Shield',
        unit: 'per troy oz (31.1g)',
        description: 'Global spot price of gold converted to EUR equivalent.',
        prices: {
          1971: 31,
          1980: 440,
          1990: 310,
          2000: 305,
          2010: 925,
          2020: 1540,
          2026: 2750
        },
        notes: 'In 1971, 1 ounce of gold was ~33.7 hours of Eurozone labor. Today it requires ~126.4 hours.'
      },
      {
        id: 'bitcoin_unit',
        name: '1 Bitcoin (BTC)',
        category: 'sound_assets',
        categoryLabel: 'Sound Assets vs. Fiat',
        iconName: 'Coins',
        unit: 'per 1 BTC',
        description: 'Spot market price of 1 Bitcoin in EUR.',
        prices: {
          1971: 0,
          1980: 0,
          1990: 0,
          2000: 0,
          2010: 0.12,
          2020: 9200,
          2026: 89000
        },
        notes: 'Requires over 4,091 hours of average labor to acquire 1 whole Bitcoin in 2026.'
      }
    ]
  }
};
