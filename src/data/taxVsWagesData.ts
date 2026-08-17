export interface TaxEraData {
  year: number;
  label: string;
  averageGrossWage: number;
  personalAllowanceOrStandardDeduction: number;
  personalAllowanceAsPercentOfWage: number;
  averageIncomeTaxRate: number; // Effective direct income tax on average worker (%)
  payrollTaxRate: number; // FICA / Employee NICs / Social Security (%)
  employerPayrollTaxRate: number; // Employer FICA / Employer NICs (%)
  consumptionTaxRate: number; // VAT / Average State+Local Sales Tax (%)
  propertyAndLocalTaxRate: number; // Property tax / Council tax as % of wage
  otherIndirectTaxesRate: number; // Fuel duty, excise, stealth fees as % of wage
  totalEffectiveTaxBurdenRate: number; // Sum of all taxes paid directly and indirectly (%)
  netTakeHomePay: number;
  totalLaborCost: number; // Gross wage + employer payroll tax
  taxFreedomDay: string; // e.g. "April 18", "May 29", "June 14"
  daysWorkedForGov: number; // Out of 365 days
  higherTaxThreshold?: number; // Higher rate threshold (e.g. 40% in UK)
  topMarginalRate: number;
  notes: string;
}

export interface TaxMarketDataset {
  marketCode: 'USD' | 'GBP' | 'EUR';
  symbol: string;
  name: string;
  countryOrRegion: string;
  sources: string[];
  historicalEras: TaxEraData[];
  taxSystemDetails: {
    incomeTaxName: string;
    payrollTaxName: string;
    employerPayrollName: string;
    salesTaxName: string;
    localTaxName: string;
    summary: string;
  };
  fiscalDragDetails: {
    title: string;
    description: string;
    examples: string[];
  };
}

export const TAX_VS_WAGES_DATA: Record<'USD' | 'GBP' | 'EUR', TaxMarketDataset> = {
  USD: {
    marketCode: 'USD',
    symbol: '$',
    name: 'United States (Federal, State & Local)',
    countryOrRegion: 'United States',
    sources: [
      'Tax Foundation (Tax Freedom Day & Historical Tax Burden Reports)',
      'US Bureau of Labor Statistics (BLS - Occupational Employment and Wage Statistics)',
      'Internal Revenue Service (IRS - Historical Individual Income Tax Rates & Brackets)',
      'Social Security Administration (SSA - Historical FICA Contribution Rates)',
      'OECD Tax Database (Taxing Wages - United States Country Report)'
    ],
    taxSystemDetails: {
      incomeTaxName: 'Federal & State Income Tax',
      payrollTaxName: 'FICA (Social Security 6.2% + Medicare 1.45%)',
      employerPayrollName: 'Employer FICA Match (7.65%)',
      salesTaxName: 'State & Local Retail Sales Tax (Avg 7.5%)',
      localTaxName: 'County / Municipal Property Taxes',
      summary: 'The US tax code relies on federal progressive income tax, regressive payroll taxes (FICA), state-level income/sales taxes, and local property taxes. While top federal marginal brackets fell from 70% in 1971 to 37% in 2026, the effective tax burden on middle-class wage earners increased due to rising FICA rates, bracket transitions, state taxes, and real estate levies.'
    },
    fiscalDragDetails: {
      title: 'US Fiscal Drag & The Alternate Minimum Tax (AMT)',
      description: 'Prior to 1985, US federal income tax brackets were not indexed for inflation, causing massive bracket creep during the 1970s stagflation. Even today, state tax brackets in 15+ states remain unindexed, capital gains tax thresholds ignore inflation, and the taxation of Social Security benefits thresholds have been frozen in nominal dollars since 1984 ($25,000 threshold), dragging millions of retirees into paying tax on their pensions.',
      examples: [
        'Social Security taxation threshold frozen at $25,000 since 1984 (would be ~$78,000+ if inflation-indexed).',
        'State income tax standard deductions in multiple states have lagged cumulative inflation by over 40%.',
        'Capital gains are taxed on nominal paper gains rather than real purchasing power increases.'
      ]
    },
    historicalEras: [
      {
        year: 1971,
        label: '1971 (Nixon Shock / Pre-Stagflation)',
        averageGrossWage: 9430,
        personalAllowanceOrStandardDeduction: 1050,
        personalAllowanceAsPercentOfWage: 11.1,
        averageIncomeTaxRate: 10.4,
        payrollTaxRate: 5.2, // FICA employee was 5.2%
        employerPayrollTaxRate: 5.2,
        consumptionTaxRate: 4.2, // Sales tax was ~4-5%
        propertyAndLocalTaxRate: 3.8,
        otherIndirectTaxesRate: 2.8,
        totalEffectiveTaxBurdenRate: 26.4,
        netTakeHomePay: 6940,
        totalLaborCost: 9920,
        taxFreedomDay: 'April 14',
        daysWorkedForGov: 104,
        topMarginalRate: 70,
        notes: 'FICA cap was only $7,800. Top marginal rate was 70% but applied only to extreme fortunes ($200k+). Average workers kept ~73.6% of earnings.'
      },
      {
        year: 1980,
        label: '1980 (Peak Stagflation & Bracket Creep)',
        averageGrossWage: 19500,
        personalAllowanceOrStandardDeduction: 2300,
        personalAllowanceAsPercentOfWage: 11.8,
        averageIncomeTaxRate: 14.8, // Inflation pushed average workers into higher brackets
        payrollTaxRate: 6.13,
        employerPayrollTaxRate: 6.13,
        consumptionTaxRate: 4.8,
        propertyAndLocalTaxRate: 3.5,
        otherIndirectTaxesRate: 3.2,
        totalEffectiveTaxBurdenRate: 32.4,
        netTakeHomePay: 13180,
        totalLaborCost: 20695,
        taxFreedomDay: 'April 28',
        daysWorkedForGov: 118,
        topMarginalRate: 70,
        notes: 'Massive bracket creep pushed middle-class families into 25-30% marginal brackets before Reagan indexation reforms in 1981/1985.'
      },
      {
        year: 1990,
        label: '1990 (Post-Tax Reform Act of 1986)',
        averageGrossWage: 31200,
        personalAllowanceOrStandardDeduction: 3250,
        personalAllowanceAsPercentOfWage: 10.4,
        averageIncomeTaxRate: 12.8,
        payrollTaxRate: 7.65, // FICA raised to 7.65%
        employerPayrollTaxRate: 7.65,
        consumptionTaxRate: 5.4,
        propertyAndLocalTaxRate: 3.9,
        otherIndirectTaxesRate: 3.1,
        totalEffectiveTaxBurdenRate: 32.8,
        netTakeHomePay: 20960,
        totalLaborCost: 33586,
        taxFreedomDay: 'April 30',
        daysWorkedForGov: 120,
        topMarginalRate: 28,
        notes: 'Top rate lowered to 28%, but FICA payroll tax hiked to 7.65% (15.3% combined), disproportionately increasing tax on working-class labor.'
      },
      {
        year: 2000,
        label: '2000 (Dot-Com Boom / Budget Surplus)',
        averageGrossWage: 42150,
        personalAllowanceOrStandardDeduction: 4400,
        personalAllowanceAsPercentOfWage: 10.4,
        averageIncomeTaxRate: 14.2,
        payrollTaxRate: 7.65,
        employerPayrollTaxRate: 7.65,
        consumptionTaxRate: 5.6,
        propertyAndLocalTaxRate: 4.1,
        otherIndirectTaxesRate: 3.4,
        totalEffectiveTaxBurdenRate: 34.9,
        netTakeHomePay: 27440,
        totalLaborCost: 45374,
        taxFreedomDay: 'May 3',
        daysWorkedForGov: 123,
        topMarginalRate: 39.6,
        notes: 'Total federal tax revenues reached 20.6% of GDP, the highest peacetime level in US history, driven by capital gains and tech salaries.'
      },
      {
        year: 2010,
        label: '2010 (Post-GFC / Bush Tax Cuts Extended)',
        averageGrossWage: 49400,
        personalAllowanceOrStandardDeduction: 5700,
        personalAllowanceAsPercentOfWage: 11.5,
        averageIncomeTaxRate: 11.9,
        payrollTaxRate: 7.65,
        employerPayrollTaxRate: 7.65,
        consumptionTaxRate: 5.8,
        propertyAndLocalTaxRate: 4.6,
        otherIndirectTaxesRate: 3.5,
        totalEffectiveTaxBurdenRate: 33.4,
        netTakeHomePay: 32900,
        totalLaborCost: 53180,
        taxFreedomDay: 'April 22',
        daysWorkedForGov: 112,
        topMarginalRate: 35,
        notes: 'Temporary payroll tax holiday (2% reduction) and recession reduced overall tax receipts temporarily.'
      },
      {
        year: 2020,
        label: '2020 (TCJA Rates & COVID Fiscal Expansion)',
        averageGrossWage: 63200,
        personalAllowanceOrStandardDeduction: 12400,
        personalAllowanceAsPercentOfWage: 19.6,
        averageIncomeTaxRate: 12.6,
        payrollTaxRate: 7.65,
        employerPayrollTaxRate: 7.65,
        consumptionTaxRate: 6.4,
        propertyAndLocalTaxRate: 4.8,
        otherIndirectTaxesRate: 3.8,
        totalEffectiveTaxBurdenRate: 35.2,
        netTakeHomePay: 40950,
        totalLaborCost: 68034,
        taxFreedomDay: 'May 2',
        daysWorkedForGov: 122,
        topMarginalRate: 37,
        notes: 'TCJA expanded standard deduction to $12,400, but rising state taxes, property assessments, and local fees offset federal savings.'
      },
      {
        year: 2026,
        label: '2026 (Present Day / Fiscal Dominance)',
        averageGrossWage: 76500,
        personalAllowanceOrStandardDeduction: 14600,
        personalAllowanceAsPercentOfWage: 19.1,
        averageIncomeTaxRate: 13.8,
        payrollTaxRate: 7.65,
        employerPayrollTaxRate: 7.65,
        consumptionTaxRate: 6.8,
        propertyAndLocalTaxRate: 5.2, // Exploding property tax re-assessments
        otherIndirectTaxesRate: 4.2,
        totalEffectiveTaxBurdenRate: 37.6,
        netTakeHomePay: 47736,
        totalLaborCost: 82352,
        taxFreedomDay: 'May 16',
        daysWorkedForGov: 136,
        topMarginalRate: 37,
        notes: 'US national debt exceeding $37 Trillion; property taxes up 35%+ since 2020 following home price surge; total effective tax take at multi-decade high.'
      }
    ]
  },

  GBP: {
    marketCode: 'GBP',
    symbol: '£',
    name: 'United Kingdom (HMRC / BoE)',
    countryOrRegion: 'United Kingdom',
    sources: [
      'Adam Smith Institute (UK Tax Freedom Day Research 1971–2026)',
      'Office for National Statistics (ONS - Average Weekly Earnings & Tax Receipts)',
      'HM Revenue & Customs (HMRC - Historical Rates of Income Tax & National Insurance)',
      'Institute for Fiscal Studies (IFS - Green Budget & Fiscal Drag Analyses)',
      'Office for Budget Responsibility (OBR - Historical Fiscal Outlooks)'
    ],
    taxSystemDetails: {
      incomeTaxName: 'Income Tax (Personal Allowance, 20%, 40%, 45%)',
      payrollTaxName: 'Employee National Insurance Contributions (NICs)',
      employerPayrollName: 'Employer NICs (13.8% to 15.0%)',
      salesTaxName: 'Value Added Tax (VAT - 20%)',
      localTaxName: 'Council Tax (Band D / Local Municipal Rates)',
      summary: 'The UK tax burden has reached its highest sustained level as a percentage of GDP since the end of the Second World War (~37.8% of GDP). A six-year freeze on the £12,570 Personal Allowance and £50,270 higher rate threshold (fiscal drag), combined with 20% VAT and soaring Council Tax, has created a severe squeeze on middle-earner wages.'
    },
    fiscalDragDetails: {
      title: 'UK Stealth Tax Freeze (The 2021–2028 Fiscal Drag Trap)',
      description: 'In 2021, the UK Chancellor froze the £12,570 Personal Allowance and £50,270 Higher Rate Threshold until 2028. Because nominal wages increased by over 22% due to post-COVID inflation, over 4.2 million additional workers were dragged into paying 40% income tax (a threshold originally designed for the top 5% of earners in 1990, now hitting teachers, senior nurses, and trade specialists).',
      examples: [
        'In 1990, only 1.7 million UK workers paid the 40% higher rate; by 2026, over 6.8 million workers pay 40% or 45%.',
        'If the Personal Allowance had tracked CPI inflation since 2021, it would be over £15,900 today instead of £12,570.',
        'Council Tax has risen by over 520% since 1993, while median wages only grew ~210% over the same period.'
      ]
    },
    historicalEras: [
      {
        year: 1971,
        label: '1971 (Pre-VAT / Purchase Tax Era)',
        averageGrossWage: 1560,
        personalAllowanceOrStandardDeduction: 418,
        personalAllowanceAsPercentOfWage: 26.8,
        averageIncomeTaxRate: 15.2,
        payrollTaxRate: 4.8, // National Insurance
        employerPayrollTaxRate: 4.8,
        consumptionTaxRate: 3.5, // Old Purchase Tax
        propertyAndLocalTaxRate: 4.2, // Old Domestic Rates
        otherIndirectTaxesRate: 3.5, // Fuel & Tobacco
        totalEffectiveTaxBurdenRate: 31.2,
        netTakeHomePay: 1073,
        totalLaborCost: 1635,
        taxFreedomDay: 'April 23',
        daysWorkedForGov: 113,
        higherTaxThreshold: 5000,
        topMarginalRate: 90, // Notorious 90% top rate on investment income
        notes: 'Personal allowance shielded 26.8% of average wage. VAT did not exist yet (introduced in 1973 at 10%).'
      },
      {
        year: 1980,
        label: '1980 (Early Thatcher / VAT Doubled to 15%)',
        averageGrossWage: 6000,
        personalAllowanceOrStandardDeduction: 1375,
        personalAllowanceAsPercentOfWage: 22.9,
        averageIncomeTaxRate: 19.5, // Basic rate was 30%
        payrollTaxRate: 6.75,
        employerPayrollTaxRate: 10.2,
        consumptionTaxRate: 6.5, // VAT hiked to 15%
        propertyAndLocalTaxRate: 4.5,
        otherIndirectTaxesRate: 4.2,
        totalEffectiveTaxBurdenRate: 41.4,
        netTakeHomePay: 3516,
        totalLaborCost: 6612,
        taxFreedomDay: 'May 30',
        daysWorkedForGov: 150,
        higherTaxThreshold: 11250,
        topMarginalRate: 60,
        notes: 'Top income tax rate cut to 60%, but standard VAT was doubled from 8% to 15%, increasing consumption tax burden on everyday workers.'
      },
      {
        year: 1990,
        label: '1990 (Late Thatcher / Poll Tax Turmoil)',
        averageGrossWage: 13700,
        personalAllowanceOrStandardDeduction: 3005,
        personalAllowanceAsPercentOfWage: 21.9,
        averageIncomeTaxRate: 16.8, // Basic rate cut to 25%
        payrollTaxRate: 9.0,
        employerPayrollTaxRate: 10.4,
        consumptionTaxRate: 6.8,
        propertyAndLocalTaxRate: 4.8, // Community Charge / Poll Tax
        otherIndirectTaxesRate: 4.4,
        totalEffectiveTaxBurdenRate: 41.8,
        netTakeHomePay: 7973,
        totalLaborCost: 15125,
        taxFreedomDay: 'June 1',
        daysWorkedForGov: 152,
        higherTaxThreshold: 20700,
        topMarginalRate: 40,
        notes: 'Basic income tax rate lowered to 25% and top rate to 40%. Community charge (Poll Tax) introduced.'
      },
      {
        year: 2000,
        label: '2000 (New Labour / Stealth Taxes)',
        averageGrossWage: 21900,
        personalAllowanceOrStandardDeduction: 4385,
        personalAllowanceAsPercentOfWage: 20.0,
        averageIncomeTaxRate: 14.5, // Basic rate lowered to 22%
        payrollTaxRate: 10.0,
        employerPayrollTaxRate: 12.2,
        consumptionTaxRate: 7.2, // VAT at 17.5%
        propertyAndLocalTaxRate: 4.9, // Council tax introduced in 1993
        otherIndirectTaxesRate: 4.8, // Fuel duty escalator
        totalEffectiveTaxBurdenRate: 41.4,
        netTakeHomePay: 12833,
        totalLaborCost: 24572,
        taxFreedomDay: 'May 30',
        daysWorkedForGov: 150,
        higherTaxThreshold: 28400,
        topMarginalRate: 40,
        notes: 'Proliferation of stealth taxes, fuel duty escalators, insurance premium tax, and pension dividend tax credit removals.'
      },
      {
        year: 2010,
        label: '2010 (Post-GFC / Austerity Era Begins)',
        averageGrossWage: 26000,
        personalAllowanceOrStandardDeduction: 6475,
        personalAllowanceAsPercentOfWage: 24.9,
        averageIncomeTaxRate: 13.2, // Basic rate 20%
        payrollTaxRate: 11.0,
        employerPayrollTaxRate: 12.8,
        consumptionTaxRate: 7.5, // VAT 17.5% -> 20% in 2011
        propertyAndLocalTaxRate: 5.4,
        otherIndirectTaxesRate: 4.9,
        totalEffectiveTaxBurdenRate: 42.0,
        netTakeHomePay: 15080,
        totalLaborCost: 29328,
        taxFreedomDay: 'June 2',
        daysWorkedForGov: 153,
        higherTaxThreshold: 37400,
        topMarginalRate: 50, // 50% top rate introduced
        notes: 'Top income tax rate raised to 50% for £150k+. VAT scheduled to increase to 20% to plug bank bailout deficits.'
      },
      {
        year: 2020,
        label: '2020 (Pre-Fiscal Drag Squeeze)',
        averageGrossWage: 31400,
        personalAllowanceOrStandardDeduction: 12500,
        personalAllowanceAsPercentOfWage: 39.8, // Higher personal allowance
        averageIncomeTaxRate: 11.4,
        payrollTaxRate: 12.0, // NICs 12%
        employerPayrollTaxRate: 13.8,
        consumptionTaxRate: 8.2, // VAT at 20%
        propertyAndLocalTaxRate: 5.8,
        otherIndirectTaxesRate: 4.8,
        totalEffectiveTaxBurdenRate: 42.2,
        netTakeHomePay: 18149,
        totalLaborCost: 35733,
        taxFreedomDay: 'June 4',
        daysWorkedForGov: 155,
        higherTaxThreshold: 50000,
        topMarginalRate: 45,
        notes: 'Personal allowance raised to £12,500, but high 20% VAT, surging Council Tax, and 12% NICs maintained 42%+ total tax take.'
      },
      {
        year: 2026,
        label: '2026 (Record Post-War UK Tax Burden)',
        averageGrossWage: 38200,
        personalAllowanceOrStandardDeduction: 12570,
        personalAllowanceAsPercentOfWage: 32.9, // Eroding due to freeze
        averageIncomeTaxRate: 13.4, // Higher effective rate due to frozen allowance
        payrollTaxRate: 8.0, // NICs adjusted but employer NICs raised to 15%
        employerPayrollTaxRate: 15.0,
        consumptionTaxRate: 8.9, // 20% VAT across inflated consumer costs
        propertyAndLocalTaxRate: 6.8, // Council tax band D over £2,200/yr
        otherIndirectTaxesRate: 5.4, // Stealth fuel, green levies, air passenger duty
        totalEffectiveTaxBurdenRate: 44.5,
        netTakeHomePay: 21191,
        totalLaborCost: 43930,
        taxFreedomDay: 'June 18',
        daysWorkedForGov: 169,
        higherTaxThreshold: 50270,
        topMarginalRate: 45,
        notes: 'Tax burden reaches highest level since 1948 (37.8% of GDP). Over 6.8M workers dragged into 40% bracket due to frozen thresholds.'
      }
    ]
  },

  EUR: {
    marketCode: 'EUR',
    symbol: '€',
    name: 'Eurozone / OECD Europe (Avg. Germany, France, Italy)',
    countryOrRegion: 'Eurozone / European Union Average',
    sources: [
      'OECD (Taxing Wages Reports & Tax Wedge Comparisons 1971–2026)',
      'Eurostat (Taxation Trends in the European Union)',
      'Institut Économique Molinari (European Tax Freedom Day Study)',
      'European Central Bank (ECB - Government Finance Statistics)',
      'Federal Ministry of Finance Germany (BMF) & French Ministry of Economy'
    ],
    taxSystemDetails: {
      incomeTaxName: 'National & Regional Progressive Income Tax',
      payrollTaxName: 'Employee Social Security Contributions (Pension, Health, Unemployment)',
      employerPayrollName: 'Employer Social Security Contributions (25%–35%)',
      salesTaxName: 'Value Added Tax (TVA / MwSt / IVA - Avg 21%)',
      localTaxName: 'Municipal / Property / Church / Housing Taxes',
      summary: 'Eurozone nations maintain the highest labor tax wedges in the developed world. Between direct income tax, compulsory social insurance (health, pension, unemployment, nursing care), and 19-22% VAT, the average Eurozone worker surrenders between 45% and 53% of their total labor cost in compulsory deductions.'
    },
    fiscalDragDetails: {
      title: 'European "Kalte Progression" & Labor Tax Wedge',
      description: 'In European economies like Germany and France, "Kalte Progression" (cold progression / fiscal drag) automatically moves cost-of-living pay raises into higher marginal tax brackets (up to 42% in Germany and 45% in France). Combined with employer social charges that exceed 30% on top of gross salary, more than half of every extra euro an employer spends on labor goes straight to the state.',
      examples: [
        'Germany\'s Tax Wedge on single workers consistently ranks #2 in the OECD at ~47.8% of total labor cost.',
        'France\'s combined employer and employee social security contributions consume over 42% of total labor cost before income tax is even calculated.',
        'Tax Freedom Day in France and Belgium routinely falls in late July (over 200 days worked for the state).'
      ]
    },
    historicalEras: [
      {
        year: 1971,
        label: '1971 (Pre-Euro National Currencies / Post-War Boom)',
        averageGrossWage: 6800, // Equivalent in EUR terms
        personalAllowanceOrStandardDeduction: 1200,
        personalAllowanceAsPercentOfWage: 17.6,
        averageIncomeTaxRate: 14.2,
        payrollTaxRate: 11.5,
        employerPayrollTaxRate: 14.5,
        consumptionTaxRate: 5.5, // VAT was ~10-12%
        propertyAndLocalTaxRate: 3.2,
        otherIndirectTaxesRate: 3.6,
        totalEffectiveTaxBurdenRate: 38.0,
        netTakeHomePay: 4216,
        totalLaborCost: 7786,
        taxFreedomDay: 'May 18',
        daysWorkedForGov: 138,
        topMarginalRate: 65,
        notes: 'Strong welfare state expansion post-1968. Social security rates began expanding rapidly.'
      },
      {
        year: 1980,
        label: '1980 (Oil Crisis & Expanding Welfare State)',
        averageGrossWage: 14500,
        personalAllowanceOrStandardDeduction: 2200,
        personalAllowanceAsPercentOfWage: 15.2,
        averageIncomeTaxRate: 17.8,
        payrollTaxRate: 14.2,
        employerPayrollTaxRate: 18.5,
        consumptionTaxRate: 6.8, // VAT increased to 14-17%
        propertyAndLocalTaxRate: 3.6,
        otherIndirectTaxesRate: 4.1,
        totalEffectiveTaxBurdenRate: 44.5,
        netTakeHomePay: 8047,
        totalLaborCost: 17182,
        taxFreedomDay: 'June 11',
        daysWorkedForGov: 162,
        topMarginalRate: 56,
        notes: 'High unemployment and stagflation drove up payroll taxes for unemployment and pension funds.'
      },
      {
        year: 1990,
        label: '1990 (Pre-Maastricht Treaty Era)',
        averageGrossWage: 23400,
        personalAllowanceOrStandardDeduction: 3100,
        personalAllowanceAsPercentOfWage: 13.2,
        averageIncomeTaxRate: 18.5,
        payrollTaxRate: 16.5,
        employerPayrollTaxRate: 21.0,
        consumptionTaxRate: 7.2, // VAT standard ~15-18%
        propertyAndLocalTaxRate: 3.8,
        otherIndirectTaxesRate: 4.5,
        totalEffectiveTaxBurdenRate: 46.5,
        netTakeHomePay: 12519,
        totalLaborCost: 28314,
        taxFreedomDay: 'June 18',
        daysWorkedForGov: 169,
        topMarginalRate: 53,
        notes: 'German reunification and preparations for the single market pushed European public spending higher.'
      },
      {
        year: 2000,
        label: '2000 (Euro Launch & Monetary Union)',
        averageGrossWage: 29800,
        personalAllowanceOrStandardDeduction: 4200,
        personalAllowanceAsPercentOfWage: 14.1,
        averageIncomeTaxRate: 19.2,
        payrollTaxRate: 18.0,
        employerPayrollTaxRate: 23.5,
        consumptionTaxRate: 7.8, // Standard VAT ~19-20%
        propertyAndLocalTaxRate: 4.0,
        otherIndirectTaxesRate: 4.8,
        totalEffectiveTaxBurdenRate: 48.8,
        netTakeHomePay: 15257,
        totalLaborCost: 36803,
        taxFreedomDay: 'June 27',
        daysWorkedForGov: 178,
        topMarginalRate: 48,
        notes: 'Introduction of the Euro. High social security contributions cemented a ~50% total tax wedge on average workers.'
      },
      {
        year: 2010,
        label: '2010 (European Sovereign Debt Crisis)',
        averageGrossWage: 36200,
        personalAllowanceOrStandardDeduction: 5200,
        personalAllowanceAsPercentOfWage: 14.4,
        averageIncomeTaxRate: 18.8,
        payrollTaxRate: 18.5,
        employerPayrollTaxRate: 24.0,
        consumptionTaxRate: 8.4, // VAT hiked across Southern Europe to 21-23%
        propertyAndLocalTaxRate: 4.4,
        otherIndirectTaxesRate: 5.1,
        totalEffectiveTaxBurdenRate: 49.2,
        netTakeHomePay: 18389,
        totalLaborCost: 44888,
        taxFreedomDay: 'June 29',
        daysWorkedForGov: 180,
        topMarginalRate: 47,
        notes: 'Emergency austerity measures raised VAT rates across Greece, Spain, Italy, and Portugal.'
      },
      {
        year: 2020,
        label: '2020 (COVID Stimulus & Green Transition)',
        averageGrossWage: 44500,
        personalAllowanceOrStandardDeduction: 7500,
        personalAllowanceAsPercentOfWage: 16.9,
        averageIncomeTaxRate: 19.4,
        payrollTaxRate: 19.0,
        employerPayrollTaxRate: 25.5,
        consumptionTaxRate: 8.8,
        propertyAndLocalTaxRate: 4.6,
        otherIndirectTaxesRate: 5.4, // Carbon & Energy taxes
        totalEffectiveTaxBurdenRate: 50.8,
        netTakeHomePay: 21894,
        totalLaborCost: 55847,
        taxFreedomDay: 'July 5',
        daysWorkedForGov: 186,
        topMarginalRate: 45,
        notes: 'Carbon levies and energy excise taxes added to standard 20-22% VAT rates.'
      },
      {
        year: 2026,
        label: '2026 (Present Day / Aging Demographics & Fiscal Strain)',
        averageGrossWage: 54200,
        personalAllowanceOrStandardDeduction: 9200,
        personalAllowanceAsPercentOfWage: 17.0,
        averageIncomeTaxRate: 20.2,
        payrollTaxRate: 20.5, // Pension and nursing care contribution hikes
        employerPayrollTaxRate: 26.5,
        consumptionTaxRate: 9.2, // 20-22% VAT + eco-tariffs
        propertyAndLocalTaxRate: 4.9,
        otherIndirectTaxesRate: 5.8, // Fuel, energy, EU ETS pass-throughs
        totalEffectiveTaxBurdenRate: 52.4,
        netTakeHomePay: 25799,
        totalLaborCost: 68563,
        taxFreedomDay: 'July 11',
        daysWorkedForGov: 192,
        topMarginalRate: 45,
        notes: 'Average Eurozone worker now works until mid-July just to pay taxes. Total tax wedge on labor exceeds 52% of total compensation.'
      }
    ]
  }
};

export const TAX_FAQS = [
  {
    q: 'What is the "Tax Wedge" and why is it much higher than my payslip says?',
    a: 'The "Tax Wedge" represents the total difference between what an employer spends to employ you (gross salary + employer payroll taxes/NICs) and what you actually take home to spend (net pay minus consumption VAT/sales taxes and local property taxes).\n\nWhile your payslip might only show a 15-20% deduction for direct Income Tax, when you account for Employee & Employer Social Security/NICs, 20% VAT on almost everything you buy, Council/Property taxes, and fuel/energy duties, the total effective tax burden on the average worker in the US, UK, and Eurozone ranges from 37.6% to 52.4%+.'
  },
  {
    q: 'How does "Fiscal Drag" (Bracket Creep) silently raise taxes without anyone voting on a tax increase?',
    a: 'Fiscal Drag occurs when tax thresholds (like the UK Personal Allowance or Higher Rate 40% band) are kept frozen while nominal wages rise with inflation.\n\nEven if your wage increase only matches inflation—meaning your real purchasing power has not improved—the additional nominal money pushes more of your income into higher tax brackets. In the UK alone, the 2021–2028 threshold freeze has dragged over 4.2 million ordinary workers into the 40% higher tax rate, generating over £40 Billion in silent annual government revenue.'
  },
  {
    q: 'What is "Tax Freedom Day" and why has it moved later into the year?',
    a: 'Tax Freedom Day is the symbolic day on the calendar when the nation as a whole has earned enough money to pay its total tax bill for the year. Every penny earned before that date goes to national, state, and local governments; only after that date do citizens start earning money for themselves and their families.\n\nIn 1971, Tax Freedom Day arrived in mid-April (working ~104 to 113 days for government). By 2026, due to expanding government budgets, social security deficits, and debt interest costs, Tax Freedom Day has moved to mid-May in the US (136 days), mid-June in the UK (169 days), and mid-July in the Eurozone (192 days).'
  },
  {
    q: 'Why is Inflation often described by economists as the "Silent 5th Tax"?',
    a: 'Nobel laureate Milton Friedman described inflation as "the one form of taxation that can be imposed without legislation." When central banks print money to fund government spending deficits, the purchasing power of all existing money is diluted. This transfers real purchasing power from savers and wage-earners directly to the government (which pays off its fixed-rate debt in cheaper, degraded currency) without any parliament or congress having to pass a formal tax bill.'
  },
  {
    q: 'How does the tax burden compare between the US, UK, and Eurozone in 2026?',
    a: '• United States: Total effective tax burden on average wages is ~37.6% (Tax Freedom Day: May 16, 136 days worked for gov). Lower consumption taxes (sales tax 6-10%) but higher local property taxes.\n\n• United Kingdom: Total effective tax burden is ~44.5% (Tax Freedom Day: June 18, 169 days worked for gov). Fueled by a post-war record 37.8% GDP tax take, 20% VAT, and the 6-year personal allowance freeze.\n\n• Eurozone (Germany/France/Italy average): Total effective tax burden is ~52.4% (Tax Freedom Day: July 11, 192 days worked for gov). Heavy employer & employee social insurance charges (~45% of labor cost) and standard 20-22% VAT rates make European labor among the most taxed on earth.'
  },
  {
    q: 'How does sound money (like Bitcoin or Gold) protect against fiscal drag and monetary taxation?',
    a: 'Unlike fiat currency, Bitcoin and physical Gold have fixed or strictly constrained mathematical supplies that cannot be debased by central banks. By storing long-term wealth in an asset with absolute scarcity, individuals can preserve their purchasing power against both monetary debasement and the artificial inflation that pushes wages into higher fiscal drag tax brackets.'
  }
];
