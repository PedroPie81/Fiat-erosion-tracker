export interface MoneySupplyDataPoint {
  year: number;
  label: string;
  m0: number; // in billions or trillions depending on currency scale
  m1: number;
  m2: number;
  m3?: number; // broad money / M4 / institutional
  centralBankAssets: number;
  event: string;
  eventDescription: string;
  goldPriceUSD?: number;
  btcPriceUSD?: number;
}

export interface CurrencyMoneySupplyConfig {
  code: 'USD' | 'GBP' | 'EUR' | 'GLOBAL';
  name: string;
  symbol: string;
  centralBankName: string;
  baseUnit: 'billion' | 'trillion';
  scaleLabel: string;
  description: string;
  broadMoneyLabel: string; // 'M3', 'M4', 'M3 / Institutional', 'Global Broad M2'
  data: MoneySupplyDataPoint[];
  milestones: {
    year: number;
    title: string;
    description: string;
    impact: string;
  }[];
  cantillonInsight: string;
  m3DiscontinuationNote?: string;
  m1RevisionNote?: string;
}

export const MONEY_SUPPLY_DATA: Record<'USD' | 'GBP' | 'EUR' | 'GLOBAL', CurrencyMoneySupplyConfig> = {
  USD: {
    code: 'USD',
    name: 'United States Dollar (USD)',
    symbol: '$',
    centralBankName: 'Federal Reserve (Fed)',
    baseUnit: 'billion',
    scaleLabel: 'Billions of USD ($B)',
    description: 'Federal Reserve monetary aggregates from 1971 to 2026, tracking base money (M0), narrow money (M1), broad money (M2), ShadowStats M3 estimates, and the Fed balance sheet.',
    broadMoneyLabel: 'M3 (Broad Money)',
    m3DiscontinuationNote: 'In March 2006, the Federal Reserve abruptly stopped publishing M3 data, claiming the collection costs exceeded the value of the information. Many economists note this masked surging offshore Eurodollar credit and institutional debt leading directly into the 2008 Global Financial Crisis.',
    m1RevisionNote: 'In May 2020, the Fed retroactively altered the definition of M1 by including savings accounts, causing M1 to instantly leap from ~$4 Trillion to over $16 Trillion overnight on official charts.',
    cantillonInsight: 'When the Fed prints trillions via Quantitative Easing (QE), primary dealer Wall Street banks and mega-corporations receive new money at zero interest rates BEFORE prices rise. By the time that capital trickles down into grocery stores, rent, and fuel, prices have risen, reducing the real purchasing power of wage earners.',
    data: [
      {
        year: 1971,
        label: '1971',
        m0: 81,
        m1: 228,
        m2: 686,
        m3: 740,
        centralBankAssets: 91,
        event: 'Nixon Shock (Gold Window Closed)',
        eventDescription: 'President Nixon unilaterally severed the USD gold peg at $35/oz, ushering in the pure unbacked global fiat experiment.',
        goldPriceUSD: 35,
        btcPriceUSD: 0
      },
      {
        year: 1980,
        label: '1980',
        m0: 157,
        m1: 408,
        m2: 1599,
        m3: 1990,
        centralBankAssets: 165,
        event: 'Volcker Tightening (20% Interest Rates)',
        eventDescription: 'Paul Volcker raised the Fed Funds rate to 20% to break 14.8% stagflation, causing a severe double-dip recession.',
        goldPriceUSD: 615,
        btcPriceUSD: 0
      },
      {
        year: 1990,
        label: '1990',
        m0: 310,
        m1: 825,
        m2: 3277,
        m3: 4150,
        centralBankAssets: 325,
        event: 'Gulf War & Early Greenspan Era',
        eventDescription: 'Alan Greenspan initiated persistent rate cuts and credit expansion, setting up the 1990s tech and real estate cycle.',
        goldPriceUSD: 383,
        btcPriceUSD: 0
      },
      {
        year: 2000,
        label: '2000',
        m0: 603,
        m1: 1088,
        m2: 4917,
        m3: 7150,
        centralBankAssets: 616,
        event: 'Dot-Com Bubble Peak & Y2K Liquidity',
        eventDescription: 'Federal Reserve injected emergency liquidity ahead of Y2K; M2 approached $5 Trillion.',
        goldPriceUSD: 279,
        btcPriceUSD: 0
      },
      {
        year: 2008,
        label: '2008',
        m0: 1475,
        m1: 1595,
        m2: 8245,
        m3: 14200,
        centralBankAssets: 2240,
        event: 'Great Financial Crisis & QE1 Launch',
        eventDescription: 'Lehman Brothers collapsed; Ben Bernanke initiated Quantitative Easing (QE1), doubling the Fed balance sheet in months.',
        goldPriceUSD: 871,
        btcPriceUSD: 0
      },
      {
        year: 2015,
        label: '2015',
        m0: 3840,
        m1: 3085,
        m2: 12310,
        m3: 19500,
        centralBankAssets: 4486,
        event: 'Post-QE3 Zero Interest Rate Regime (ZIRP)',
        eventDescription: 'Fed concluded QE3 with its balance sheet near $4.5T. M2 surpassed $12 Trillion—a 17x increase since 1971.',
        goldPriceUSD: 1060,
        btcPriceUSD: 430
      },
      {
        year: 2019,
        label: '2019',
        m0: 3430,
        m1: 3980,
        m2: 15330,
        m3: 24800,
        centralBankAssets: 4170,
        event: 'September 2019 Repo Crisis',
        eventDescription: 'Overnight interbank repo rates spiked to 10%, forcing the Fed to resume "Not-QE" liquidity injections.',
        goldPriceUSD: 1515,
        btcPriceUSD: 7200
      },
      {
        year: 2020,
        label: '2020',
        m0: 5210,
        m1: 17840,
        m2: 19120,
        m3: 30400,
        centralBankAssets: 7363,
        event: 'COVID-19 Monetary Flood (CARES Act & QE Infinity)',
        eventDescription: 'The Fed created $3+ Trillion in months. M2 grew by over 25% in a single year—the fastest rate in modern US history.',
        goldPriceUSD: 1890,
        btcPriceUSD: 29000
      },
      {
        year: 2022,
        label: '2022',
        m0: 5610,
        m1: 20650,
        m2: 21720,
        m3: 34200,
        centralBankAssets: 8965,
        event: 'Peak M2 & Aggressive Rate Hikes',
        eventDescription: 'CPI reached 9.1%. The Fed began rapid 75 bps rate hikes and quantitative tightening (QT) balance sheet runoff.',
        goldPriceUSD: 1825,
        btcPriceUSD: 16500
      },
      {
        year: 2024,
        label: '2024',
        m0: 5780,
        m1: 18050,
        m2: 20980,
        m3: 33800,
        centralBankAssets: 7450,
        event: 'Fiscal Dominance & US National Debt at $35T',
        eventDescription: 'US national debt crossed $35 Trillion with $1.1T annual interest costs, putting pressure on Fed QT.',
        goldPriceUSD: 2650,
        btcPriceUSD: 96000
      },
      {
        year: 2026,
        label: '2026',
        m0: 5920,
        m1: 18450,
        m2: 21680,
        m3: 35100,
        centralBankAssets: 6980,
        event: 'Sticky Inflation & Sustained Money Supply Expansion',
        eventDescription: 'USD M2 hovers near $21.7 Trillion—up 3,060% (31.6x) since 1971, while Fed total assets remain ~76x higher than 1971.',
        goldPriceUSD: 2890,
        btcPriceUSD: 98500
      }
    ],
    milestones: [
      {
        year: 1971,
        title: 'Nixon Closes Gold Window ($686B M2)',
        description: 'US severed the direct link between the dollar and gold. Since this date, M2 has expanded from $686 Billion to over $21.6 Trillion.',
        impact: '+3,060% M2 expansion since 1971'
      },
      {
        year: 2006,
        title: 'Fed Discontinues M3 Reporting',
        description: 'In March 2006, the Federal Reserve halted public M3 metrics, concealing explosive growth in shadow-banking eurodollars and derivatives.',
        impact: 'Institutional opacity before 2008 GFC'
      },
      {
        year: 2008,
        title: 'Quantitative Easing (QE) Introduced',
        description: 'Ben Bernanke initiated direct purchases of US Treasuries and mortgage-backed securities, expanding the Fed balance sheet from $870B to over $4.5T.',
        impact: 'Balance sheet expanded 5x in 6 years'
      },
      {
        year: 2020,
        title: 'COVID Liquidity Bazooka ($4T Created)',
        description: 'Between March 2020 and late 2021, over 25% of all existing US dollars in circulation were created out of thin air.',
        impact: 'Largest 12-month money supply spike in US history'
      }
    ]
  },

  GBP: {
    code: 'GBP',
    name: 'British Pound Sterling (GBP)',
    symbol: '£',
    centralBankName: 'Bank of England (BoE)',
    baseUnit: 'billion',
    scaleLabel: 'Billions of GBP (£B)',
    description: 'Bank of England monetary aggregates from 1971 to 2026, detailing physical notes & coins (M0), M4 broad money, and the BoE Asset Purchase Facility balance sheet.',
    broadMoneyLabel: 'M4 (UK Broad Money)',
    m3DiscontinuationNote: 'In the UK, the Bank of England relies on M4 (notes and coins, bank deposits, and repos) as the benchmark measure for broad liquidity.',
    m1RevisionNote: 'Following the 2008 banking crisis and the 2016 Brexit referendum, the BoE initiated massive gilt purchase schemes via the Asset Purchase Facility (APF).',
    cantillonInsight: 'The City of London financial services sector and commercial banks are the first recipients of newly minted Sterling liquidity, inflating prime UK residential property in London and the South East while real wages across the UK experienced a multi-decade wage stagnation.',
    data: [
      {
        year: 1971,
        label: '1971',
        m0: 3.8,
        m1: 8.5,
        m2: 12.8,
        m3: 16.5,
        centralBankAssets: 4.2,
        event: 'Decimalisation & Post-Empire Sterling',
        eventDescription: 'UK transitioned to decimal currency amidst high union strikes and rising inflation.',
        goldPriceUSD: 35,
        btcPriceUSD: 0
      },
      {
        year: 1980,
        label: '1980',
        m0: 11.2,
        m1: 28.5,
        m2: 55.4,
        m3: 84.3,
        centralBankAssets: 13.5,
        event: 'Thatcher Monetarism & Sterling Crisis',
        eventDescription: 'Thatcher government raised interest rates to 17% to combat 22% UK inflation.',
        goldPriceUSD: 615,
        btcPriceUSD: 0
      },
      {
        year: 1990,
        label: '1990',
        m0: 19.5,
        m1: 145.0,
        m2: 320.0,
        m3: 445.0,
        centralBankAssets: 24.0,
        event: 'Exchange Rate Mechanism (ERM) Entry',
        eventDescription: 'UK joined the European ERM; broad money M4 expanded rapidly during the Lawson boom.',
        goldPriceUSD: 383,
        btcPriceUSD: 0
      },
      {
        year: 2000,
        label: '2000',
        m0: 34.8,
        m1: 310.0,
        m2: 620.0,
        m3: 835.0,
        centralBankAssets: 45.2,
        event: 'BoE Independence & Dot-Com Era',
        eventDescription: 'Tony Blair granted operational independence to the Bank of England in 1997.',
        goldPriceUSD: 279,
        btcPriceUSD: 0
      },
      {
        year: 2008,
        label: '2008',
        m0: 53.2,
        m1: 680.0,
        m2: 1420.0,
        m3: 1920.0,
        centralBankAssets: 245.0,
        event: 'Northern Rock & RBS Bailouts / QE1',
        eventDescription: 'UK nationalized Northern Rock and injected £45B into RBS. BoE commenced quantitative easing.',
        goldPriceUSD: 871,
        btcPriceUSD: 0
      },
      {
        year: 2015,
        label: '2015',
        m0: 74.5,
        m1: 1050.0,
        m2: 1840.0,
        m3: 2240.0,
        centralBankAssets: 410.0,
        event: 'Extended QE & Pre-Brexit Stagnation',
        eventDescription: 'Bank of England expanded the Asset Purchase Facility to £375 Billion.',
        goldPriceUSD: 1060,
        btcPriceUSD: 430
      },
      {
        year: 2019,
        label: '2019',
        m0: 88.0,
        m1: 1320.0,
        m2: 2180.0,
        m3: 2650.0,
        centralBankAssets: 495.0,
        event: 'Pre-COVID Record M4 Broad Money',
        eventDescription: 'UK M4 reached £2.65 Trillion, representing a 160x increase compared to 1971.',
        goldPriceUSD: 1515,
        btcPriceUSD: 7200
      },
      {
        year: 2020,
        label: '2020',
        m0: 95.0,
        m1: 1580.0,
        m2: 2490.0,
        m3: 3020.0,
        centralBankAssets: 895.0,
        event: 'COVID Emergency APF Scheme',
        eventDescription: 'BoE expanded QE to £895 Billion, buying almost the entire UK deficit in sovereign gilts.',
        goldPriceUSD: 1890,
        btcPriceUSD: 29000
      },
      {
        year: 2022,
        label: '2022',
        m0: 98.5,
        m1: 1720.0,
        m2: 2680.0,
        m3: 3280.0,
        centralBankAssets: 1090.0,
        event: 'Truss Mini-Budget & Pension Gilt Crisis',
        eventDescription: 'UK LDI pension funds faced collapse as 30-year yields surged; BoE executed emergency gilt intervention.',
        goldPriceUSD: 1825,
        btcPriceUSD: 16500
      },
      {
        year: 2024,
        label: '2024',
        m0: 96.2,
        m1: 1640.0,
        m2: 2590.0,
        m3: 3180.0,
        centralBankAssets: 910.0,
        event: 'Active Quantitative Tightening (QT)',
        eventDescription: 'BoE became the only major central bank actively selling gilts back to the market at a loss.',
        goldPriceUSD: 2650,
        btcPriceUSD: 96000
      },
      {
        year: 2026,
        label: '2026',
        m0: 97.8,
        m1: 1710.0,
        m2: 2690.0,
        m3: 3340.0,
        centralBankAssets: 840.0,
        event: 'UK Broad Money at £3.34 Trillion',
        eventDescription: 'UK M4 Broad Money stands at £3.34 Trillion—a 202x expansion (+20,140%) since 1971.',
        goldPriceUSD: 2890,
        btcPriceUSD: 98500
      }
    ],
    milestones: [
      {
        year: 1971,
        title: 'Nixon Shock & UK Float (£16.5B M4)',
        description: 'Sterling unpegged from fixed gold parity, allowing UK broad money to expand exponentially from £16.5 Billion to £3.34 Trillion.',
        impact: '+20,140% M4 expansion since 1971'
      },
      {
        year: 2009,
        title: 'Asset Purchase Facility (APF) QE Launch',
        description: 'Bank of England began purchasing UK Government Gilts to inject liquidity directly into London clearing banks.',
        impact: 'BoE balance sheet scaled from £45B to over £1,000B'
      },
      {
        year: 2022,
        title: 'UK Pension Gilt Bailout (£1.09T Peak Assets)',
        description: 'When UK pension Liability-Driven Investment (LDI) strategies faced insolvency, the BoE paused QT and bought £19B in long-dated gilts in days.',
        impact: 'Proof of monetary intervention whenever bond markets fail'
      }
    ]
  },

  EUR: {
    code: 'EUR',
    name: 'Eurozone (EUR)',
    symbol: '€',
    centralBankName: 'European Central Bank (ECB)',
    baseUnit: 'billion',
    scaleLabel: 'Billions of EUR (€B)',
    description: 'European Central Bank monetary aggregates from 1971 to 2026 (synthetic pre-1999 Deutschmark/French Franc composite, official ECB aggregates from 1999 onward).',
    broadMoneyLabel: 'M3 (Eurozone Broad Money)',
    m3DiscontinuationNote: 'Unlike the US Fed, the ECB still officially tracks and publishes M3 broad money as a primary pillar of its monetary policy strategy.',
    m1RevisionNote: 'Between 2015 and 2022, Mario Draghi and Christine Lagarde expanded the ECB balance sheet to over €8.8 Trillion via PSPP, PEPP, and TLTRO lending operations.',
    cantillonInsight: 'Target2 balances and ECB bond purchases disproportionately subsidized sovereign debt in southern Europe and financed corporate conglomerates, while Eurozone depositors suffered negative interest rates (-0.50%) on cash for 8 consecutive years (2014-2022).',
    data: [
      {
        year: 1971,
        label: '1971',
        m0: 45,
        m1: 140,
        m2: 310,
        m3: 420,
        centralBankAssets: 85,
        event: 'Pre-Euro National Currencies (Synthetic Base)',
        eventDescription: 'Composite estimate across West Germany (DM), France (FRF), Italy (ITL), and Benelux central banks.',
        goldPriceUSD: 35,
        btcPriceUSD: 0
      },
      {
        year: 1980,
        label: '1980',
        m0: 110,
        m1: 480,
        m2: 1120,
        m3: 1450,
        centralBankAssets: 280,
        event: 'European Monetary System (EMS) Creation',
        eventDescription: 'Creation of the European Currency Unit (ECU) to limit currency volatility.',
        goldPriceUSD: 615,
        btcPriceUSD: 0
      },
      {
        year: 1990,
        label: '1990',
        m0: 240,
        m1: 1150,
        m2: 2680,
        m3: 3350,
        centralBankAssets: 560,
        event: 'German Reunification & Maastricht Treaty Roadmap',
        eventDescription: '1:1 Ostmark exchange expanded the monetary base; Maastricht blueprint for the single currency.',
        goldPriceUSD: 383,
        btcPriceUSD: 0
      },
      {
        year: 2000,
        label: '2000',
        m0: 420,
        m1: 1980,
        m2: 4250,
        m3: 4850,
        centralBankAssets: 760,
        event: 'Euro Launch (Official ECB Inception)',
        eventDescription: 'ECB took over monetary policy for 11 founding member states; physical Euro notes introduced in 2002.',
        goldPriceUSD: 279,
        btcPriceUSD: 0
      },
      {
        year: 2008,
        label: '2008',
        m0: 980,
        m1: 4050,
        m2: 8150,
        m3: 9420,
        centralBankAssets: 2075,
        event: 'Global Financial Crisis & ECB Collateral Easing',
        eventDescription: 'ECB injected unlimited liquidity at fixed rates against increasingly broad bank collateral.',
        goldPriceUSD: 871,
        btcPriceUSD: 0
      },
      {
        year: 2015,
        label: '2015',
        m0: 1750,
        m1: 6480,
        m2: 10250,
        m3: 10870,
        centralBankAssets: 2780,
        event: '"Whatever It Takes" & Negative Interest Rates',
        eventDescription: 'Mario Draghi launched full Public Sector Purchase Programme (PSPP QE) and pushed deposit rates to -0.20%.',
        goldPriceUSD: 1060,
        btcPriceUSD: 430
      },
      {
        year: 2019,
        label: '2019',
        m0: 3180,
        m1: 8980,
        m2: 12460,
        m3: 13050,
        centralBankAssets: 4670,
        event: 'Negative Rates Deepen to -0.50%',
        eventDescription: 'ECB restarted QE at €20B/month as European economic growth stalled.',
        goldPriceUSD: 1515,
        btcPriceUSD: 7200
      },
      {
        year: 2020,
        label: '2020',
        m0: 5120,
        m1: 10420,
        m2: 14100,
        m3: 14520,
        centralBankAssets: 7025,
        event: 'Pandemic Emergency Purchase Programme (PEPP)',
        eventDescription: 'ECB initiated €1.85 Trillion PEPP bond-buying scheme without standard member-state issuer limits.',
        goldPriceUSD: 1890,
        btcPriceUSD: 29000
      },
      {
        year: 2022,
        label: '2022',
        m0: 6150,
        m1: 11680,
        m2: 15480,
        m3: 16100,
        centralBankAssets: 8830,
        event: 'Peak ECB Balance Sheet (€8.83 Trillion)',
        eventDescription: 'ECB total assets reached a staggering 70% of Eurozone GDP before starting TLTRO repayments.',
        goldPriceUSD: 1825,
        btcPriceUSD: 16500
      },
      {
        year: 2024,
        label: '2024',
        m0: 4250,
        m1: 10380,
        m2: 15310,
        m3: 16250,
        centralBankAssets: 6780,
        event: 'Anti-Fragmentation Transmission Tool (TPI)',
        eventDescription: 'ECB instituted the Transmission Protection Instrument to prevent Italian and Greek spreads from blowing out.',
        goldPriceUSD: 2650,
        btcPriceUSD: 96000
      },
      {
        year: 2026,
        label: '2026',
        m0: 4380,
        m1: 10750,
        m2: 15820,
        m3: 16840,
        centralBankAssets: 6250,
        event: 'Eurozone M3 Reaches €16.84 Trillion',
        eventDescription: 'Eurozone broad money stands at €16.84 Trillion—a 40x expansion (+3,910%) compared to 1971 synthetic estimates.',
        goldPriceUSD: 2890,
        btcPriceUSD: 98500
      }
    ],
    milestones: [
      {
        year: 1999,
        title: 'Euro Launch (€4.85T M3 in 2000)',
        description: 'Single currency established. Eurozone M3 expanded from €4.85 Trillion in 2000 to €16.84 Trillion in 2026.',
        impact: '+247% M3 expansion since 2000'
      },
      {
        year: 2014,
        title: 'Negative Deposit Rates (-0.50%)',
        description: 'ECB charged commercial banks up to 0.50% annually to hold reserves, penalizing traditional cash savers across Europe.',
        impact: 'First major central bank to enforce negative yields'
      },
      {
        year: 2020,
        title: 'PEPP & TLTRO (€8.83T Peak Balance Sheet)',
        description: 'ECB balance sheet exceeded 70% of Eurozone GDP during COVID emergency interventions.',
        impact: 'ECB assets reached €8.83 Trillion in 2022'
      }
    ]
  },

  GLOBAL: {
    code: 'GLOBAL',
    name: 'Global Aggregate (G4 + Major Central Banks)',
    symbol: '$',
    centralBankName: 'G4 Central Banks (Fed, ECB, BoJ, PBOC, BoE, SNB)',
    baseUnit: 'trillion',
    scaleLabel: 'Trillions of USD ($T)',
    description: 'Aggregated global money supply (Global M2 in USD equivalent) and total central bank balance sheet assets across the Federal Reserve, ECB, Bank of Japan, People\'s Bank of China, and Bank of England.',
    broadMoneyLabel: 'Global M2 Aggregate ($ Trillions)',
    m3DiscontinuationNote: 'Global broad liquidity encompasses cross-border USD Eurodollar offshore claims, non-bank shadow financial intermediaries, and multi-currency repo collateral markets.',
    m1RevisionNote: 'Global central bank balance sheets expanded from under $5 Trillion in 2000 to over $42 Trillion following the 2020 COVID coordinated global liquidity response.',
    cantillonInsight: 'Global liquidity moves in synchronized waves. Whenever G4 central bank balance sheets expand, scarce global assets—including Bitcoin, Gold, US Equities, and Prime Urban Real Estate—consistently outpace consumer price indexes with a 3 to 6-month lag.',
    data: [
      {
        year: 1971,
        label: '1971',
        m0: 0.35,
        m1: 0.85,
        m2: 2.10,
        m3: 2.65,
        centralBankAssets: 0.35,
        event: 'Bretton Woods System Ends',
        eventDescription: 'End of international gold convertibility unleashed sovereign fiat creation globally.',
        goldPriceUSD: 35,
        btcPriceUSD: 0
      },
      {
        year: 1980,
        label: '1980',
        m0: 1.10,
        m1: 2.70,
        m2: 6.80,
        m3: 8.40,
        centralBankAssets: 1.10,
        event: 'Global Stagflation & Oil Crisis',
        eventDescription: 'OPEC oil shock and synchronized global fiat inflation across Western and developing nations.',
        goldPriceUSD: 615,
        btcPriceUSD: 0
      },
      {
        year: 1990,
        label: '1990',
        m0: 2.40,
        m1: 6.20,
        m2: 16.50,
        m3: 20.80,
        centralBankAssets: 2.40,
        event: 'Japan Asset Bubble Collapse & Cold War End',
        eventDescription: 'Bank of Japan bubble burst; Bank of Japan became the pioneer of ZIRP zero-rate policy.',
        goldPriceUSD: 383,
        btcPriceUSD: 0
      },
      {
        year: 2000,
        label: '2000',
        m0: 4.60,
        m1: 11.20,
        m2: 28.40,
        m3: 36.20,
        centralBankAssets: 4.60,
        event: 'Dot-Com Crash & China WTO Entry',
        eventDescription: 'China joined the WTO in 2001, anchoring global consumer goods prices while expanding internal credit.',
        goldPriceUSD: 279,
        btcPriceUSD: 0
      },
      {
        year: 2008,
        label: '2008',
        m0: 10.80,
        m1: 19.50,
        m2: 51.20,
        m3: 65.00,
        centralBankAssets: 10.80,
        event: 'Global Financial Crisis & Synchronized QE',
        eventDescription: 'G20 London Summit coordinated global fiscal and monetary stimulus. PBOC launched 4T Yuan package.',
        goldPriceUSD: 871,
        btcPriceUSD: 0
      },
      {
        year: 2015,
        label: '2015',
        m0: 22.40,
        m1: 29.80,
        m2: 74.50,
        m3: 92.00,
        centralBankAssets: 22.40,
        event: 'Abenomics & European QE Expansion',
        eventDescription: 'BoJ, ECB, and PBOC expanded balance sheets simultaneously, driving global negative-yielding debt to $18T.',
        goldPriceUSD: 1060,
        btcPriceUSD: 430
      },
      {
        year: 2019,
        label: '2019',
        m0: 26.80,
        m1: 37.50,
        m2: 91.80,
        m3: 114.00,
        centralBankAssets: 26.80,
        event: 'Pre-Pandemic Global Broad Money ($91.8T)',
        eventDescription: 'Global M2 approached $92 Trillion, representing a 43x increase over 1971 levels.',
        goldPriceUSD: 1515,
        btcPriceUSD: 7200
      },
      {
        year: 2020,
        label: '2020',
        m0: 38.20,
        m1: 49.50,
        m2: 106.40,
        m3: 132.00,
        centralBankAssets: 38.20,
        event: 'Global Synchronized COVID Stimulus ($14T Added)',
        eventDescription: 'Worldwide central banks and treasuries injected unprecedented fiscal and monetary liquidity simultaneously.',
        goldPriceUSD: 1890,
        btcPriceUSD: 29000
      },
      {
        year: 2022,
        label: '2022',
        m0: 42.50,
        m1: 54.00,
        m2: 118.50,
        m3: 148.00,
        centralBankAssets: 42.50,
        event: 'Peak Global Central Bank Assets ($42.5 Trillion)',
        eventDescription: 'Central banks began the fastest coordinated interest rate hiking cycle in 40 years to curb worldwide inflation.',
        goldPriceUSD: 1825,
        btcPriceUSD: 16500
      },
      {
        year: 2024,
        label: '2024',
        m0: 37.80,
        m1: 52.50,
        m2: 122.00,
        m3: 154.00,
        centralBankAssets: 37.80,
        event: 'Global Sovereign Debt Exceeds $100 Trillion',
        eventDescription: 'Global public debt reached $100 Trillion (93% of global GDP), driving renewed central bank rate cuts.',
        goldPriceUSD: 2650,
        btcPriceUSD: 96000
      },
      {
        year: 2026,
        label: '2026',
        m0: 36.20,
        m1: 55.20,
        m2: 128.40,
        m3: 162.00,
        centralBankAssets: 36.20,
        event: 'Global M2 Money Supply Surpasses $128 Trillion',
        eventDescription: 'Worldwide M2 stands at an astounding $128.4 Trillion—a 61x increase (+6,014%) since 1971.',
        goldPriceUSD: 2890,
        btcPriceUSD: 98500
      }
    ],
    milestones: [
      {
        year: 1971,
        title: 'Global Fiat Standard Inception ($2.1T M2)',
        description: 'The demise of Bretton Woods gold convertibility allowed all nation-states to expand unbacked fiat currencies simultaneously.',
        impact: '+6,014% Global M2 expansion since 1971'
      },
      {
        year: 2008,
        title: 'G20 Global Coordinated Quantitative Easing',
        description: 'Central banks in the US, Europe, Japan, and the UK collectively quadrupled their balance sheets from $10T to over $42T.',
        impact: 'Central bank balance sheets expanded 4x'
      },
      {
        year: 2020,
        title: 'COVID Emergency Response ($14T Surge)',
        description: 'The single largest coordinated monetary expansion in human civilization: $14.6 Trillion injected in under 24 months.',
        impact: 'Global M2 surged past $100 Trillion for the first time'
      }
    ]
  }
};

export const MONEY_SUPPLY_FAQS = [
  {
    q: 'What is the exact difference between M0, M1, M2, M3, and M4 money supply?',
    a: 'Monetary aggregates measure money across varying degrees of liquidity and spendability:\n\n• M0 (Monetary Base / Base Money): Physical currency (banknotes & coins) in circulation plus commercial bank reserve balances held at the central bank. Known as "high-powered money".\n\n• M1 (Narrow Money): Physical currency in circulation + demand checkable deposits + highly liquid checking accounts directly usable for everyday payments.\n\n• M2 (Broad Money): M1 + savings deposits + small time deposits (CDs < $100k) + retail money market mutual funds. M2 is the primary benchmark for consumer purchasing power in the economy.\n\n• M3 / M4 (Broadest Liquidity): M2 + large-denomination institutional time deposits + Eurodollar deposits + repurchase agreements (repos) + institutional money market funds. M3 captures institutional and shadow banking liquidity.'
  },
  {
    q: 'Why did the US Federal Reserve stop publishing M3 broad money data in March 2006?',
    a: 'On March 23, 2006, the Federal Reserve abruptly stopped publishing M3, stating that collecting the data was costly and did not provide substantial monetary insight beyond M2. However, many independent monetary economists and analysts (such as ShadowStats) noted that M3 was expanding at over 15% annually right before the 2008 subprime meltdown. Discontinuing M3 obscured massive offshore Eurodollar credit expansion, structured investment vehicles (SIVs), and institutional repo borrowing that caused the 2008 Global Financial Crisis.'
  },
  {
    q: 'Why did M1 spike dramatically by over 300% in May 2020?',
    a: 'In May 2020, the Federal Reserve officially changed its accounting definition of M1 by eliminating Regulation D restrictions that previously capped savings account withdrawals at 6 per month. Consequently, trillions of dollars previously classified exclusively under M2 savings accounts were merged into M1 checkable liquidity. This caused M1 to jump from ~$4 Trillion to over $16 Trillion overnight on FRED charts. While the reclassification accounted for the visual spike, real broad liquidity (M2) still surged by an unprecedented 25%+ in a single year due to COVID stimulus.'
  },
  {
    q: 'What is the Cantillon Effect and why does money supply expansion increase wealth inequality?',
    a: 'Named after 18th-century French-Irish economist Richard Cantillon, the Cantillon Effect states that when new fiat money is created, it does not distribute evenly across society. The primary recipients—governments, primary dealer Wall Street banks, defense contractors, and private equity giants—receive the freshly created money first at near-zero interest rates, buying prime real estate, stocks, and commodities before prices rise. By the time that newly created money trickles down to wage workers and pensioners, consumer prices have already inflated, acting as a regressive hidden tax on savers.'
  },
  {
    q: 'How does global money supply expansion correlate with Bitcoin and Gold prices?',
    a: 'Empirical data shows that Bitcoin and Gold act as pristine liquidity barometers. Over the 2010–2026 period, Bitcoin exhibited an ~80%+ directional correlation with Global M2 money supply with an average 3 to 6-month lag. When central banks expand balance sheets and broad money grows faster than economic output, capital seeks finite, non-dilutable stores of value. While fiat currencies expand continuously (USD M2 up 31x since 1971; GBP M4 up 202x), Bitcoin’s absolute 21 million supply cap cannot be altered by central bank decrees.'
  },
  {
    q: 'How do commercial banks create 90%+ of the money supply through fractional reserve banking?',
    a: 'Contrary to popular belief, governments and central banks do not print most circulating money. Under fractional reserve and credit-based commercial banking, when a bank issues a mortgage or corporate loan, it does not lend out another depositor’s saved funds. Instead, it simultaneously creates a brand new deposit asset on its balance sheet out of thin air. When the borrower repays the principal, that money is extinguished. When credit expands faster than debt retirement, broad money supply (M2/M3) swells.'
  },
  {
    q: 'What is "Fiscal Dominance" and why can\'t central banks sustain Quantitative Tightening (QT)?',
    a: 'Fiscal dominance occurs when a government\'s national debt and annual interest payments become so massive that the central bank is forced to subordinate its inflation targets to keep the sovereign government solvent. With US national debt exceeding $35 Trillion and annual interest payments surpassing $1.1 Trillion (more than the US defense budget), high interest rates threaten sovereign bond market liquidity. Central banks are eventually forced to stop Quantitative Tightening and resume debt monetization (QE) to prevent sovereign debt auctions from failing.'
  }
];
