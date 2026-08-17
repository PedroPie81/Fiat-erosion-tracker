import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  Landmark,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Coins,
  Scale,
  Sparkles,
  Info,
  Building,
  Briefcase,
  Layers,
  ArrowUpRight,
  Receipt,
  FileSpreadsheet,
  Zap,
  Lock,
  Compass
} from 'lucide-react';
import { TAX_VS_WAGES_DATA, TAX_FAQS, TaxEraData } from '../data/taxVsWagesData';

type MarketType = 'USD' | 'GBP' | 'EUR';

const TaxVsWagesPage: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('GBP');
  const [userGrossSalary, setUserGrossSalary] = useState<number>(38200);
  const [includeEmployerTaxes, setIncludeEmployerTaxes] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const marketData = TAX_VS_WAGES_DATA[selectedMarket];
  const latestEra = marketData.historicalEras[marketData.historicalEras.length - 1];
  const era1971 = marketData.historicalEras[0];

  // Update default salary when market changes
  const handleMarketChange = (market: MarketType) => {
    setSelectedMarket(market);
    if (market === 'USD') setUserGrossSalary(76500);
    else if (market === 'GBP') setUserGrossSalary(38200);
    else if (market === 'EUR') setUserGrossSalary(54200);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Dynamic Personal Tax Breakdown Calculation
  const personalCalc = useMemo(() => {
    const gross = Math.max(0, userGrossSalary || 0);
    const era = latestEra;

    let incomeTax = 0;
    let payrollTax = 0;
    let employerTax = 0;
    let consumptionVat = 0;
    let localPropertyTax = 0;
    let indirectOther = 0;

    if (selectedMarket === 'GBP') {
      // UK 2026 Income Tax: PA £12,570, Basic 20% to £50,270, Higher 40%
      const personalAllowance = 12570;
      if (gross > personalAllowance) {
        const taxable = gross - personalAllowance;
        const basicBand = Math.min(taxable, 50270 - personalAllowance);
        const higherBand = Math.max(0, Math.min(taxable - basicBand, 125140 - 50270));
        const additionalBand = Math.max(0, taxable - (125140 - personalAllowance));
        incomeTax = basicBand * 0.20 + higherBand * 0.40 + additionalBand * 0.45;
      }
      // Employee NICs: ~8% between £12,570 and £50,270, 2% above
      if (gross > 12570) {
        const nicBand1 = Math.min(gross - 12570, 50270 - 12570);
        const nicBand2 = Math.max(0, gross - 50270);
        payrollTax = nicBand1 * 0.08 + nicBand2 * 0.02;
      }
      // Employer NICs: 15% above £5,000 threshold
      if (gross > 5000) {
        employerTax = (gross - 5000) * 0.15;
      }
      // VAT: estimated 20% on ~45% of disposable post-tax income spent on standard rated goods
      const disposable = Math.max(0, gross - incomeTax - payrollTax);
      consumptionVat = disposable * 0.45 * (0.20 / 1.20);
      // Council Tax Band D avg ~£2,200
      localPropertyTax = Math.min(3200, Math.max(1600, gross * 0.055));
      indirectOther = gross * 0.045; // Fuel duty, insurance premium tax, excise
    } else if (selectedMarket === 'USD') {
      // US 2026: Standard Deduction $14,600
      const stdDeduction = 14600;
      const taxable = Math.max(0, gross - stdDeduction);
      // Federal brackets approx: 10% up to $11.6k, 12% to $47.1k, 22% to $100.5k, 24% above
      if (taxable <= 11600) {
        incomeTax = taxable * 0.10;
      } else if (taxable <= 47150) {
        incomeTax = 11600 * 0.10 + (taxable - 11600) * 0.12;
      } else if (taxable <= 100525) {
        incomeTax = 11600 * 0.10 + (47150 - 11600) * 0.12 + (taxable - 47150) * 0.22;
      } else {
        incomeTax = 11600 * 0.10 + (47150 - 11600) * 0.12 + (100525 - 47150) * 0.22 + (taxable - 100525) * 0.24;
      }
      // Add state income tax avg ~4.5%
      incomeTax += Math.max(0, gross - 8000) * 0.045;
      // FICA: 7.65% (6.2% SS up to $168k + 1.45% Medicare)
      payrollTax = Math.min(gross, 168600) * 0.062 + gross * 0.0145;
      employerTax = payrollTax; // Exact match
      // Sales Tax: avg 7.5% on 40% of disposable
      const disposable = Math.max(0, gross - incomeTax - payrollTax);
      consumptionVat = disposable * 0.40 * 0.075;
      localPropertyTax = Math.max(1800, gross * 0.048);
      indirectOther = gross * 0.038;
    } else {
      // EUR Average:
      const allowance = 9200;
      const taxable = Math.max(0, gross - allowance);
      incomeTax = taxable * 0.26; // Avg progressive income tax
      payrollTax = gross * 0.205; // Health, pension, unemployment
      employerTax = gross * 0.265; // Employer social wedge
      const disposable = Math.max(0, gross - incomeTax - payrollTax);
      consumptionVat = disposable * 0.50 * (0.21 / 1.21); // 21% VAT
      localPropertyTax = gross * 0.045;
      indirectOther = gross * 0.052;
    }

    const directTaxes = incomeTax + payrollTax;
    const indirectTaxes = consumptionVat + localPropertyTax + indirectOther;
    const totalTaxesPaidByWorker = directTaxes + indirectTaxes;
    const totalTaxesWithEmployer = totalTaxesPaidByWorker + (includeEmployerTaxes ? employerTax : 0);
    const totalEconomicCompensation = gross + (includeEmployerTaxes ? employerTax : 0);

    const trueEffectiveTaxRate = totalEconomicCompensation > 0 
      ? (totalTaxesWithEmployer / totalEconomicCompensation) * 100 
      : 0;

    const netTakeHome = Math.max(0, gross - directTaxes - indirectTaxes);
    const daysWorkedForGov = Math.round((trueEffectiveTaxRate / 100) * 365);

    // Calculate Tax Freedom Date
    const startOfYear = new Date(2026, 0, 1);
    const freedomDate = new Date(startOfYear.setDate(startOfYear.getDate() + daysWorkedForGov));
    const freedomDateStr = freedomDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return {
      gross,
      incomeTax,
      payrollTax,
      employerTax,
      consumptionVat,
      localPropertyTax,
      indirectOther,
      directTaxes,
      indirectTaxes,
      totalTaxesPaidByWorker,
      totalTaxesWithEmployer,
      totalEconomicCompensation,
      trueEffectiveTaxRate,
      netTakeHome,
      daysWorkedForGov,
      freedomDateStr
    };
  }, [userGrossSalary, selectedMarket, includeEmployerTaxes, latestEra]);

  // Chart dataset transformation
  const chartData = useMemo(() => {
    return marketData.historicalEras.map((era) => ({
      year: era.year,
      label: era.year.toString(),
      'Income Tax (%)': era.averageIncomeTaxRate,
      'Payroll / Social Security (%)': era.payrollTaxRate,
      'VAT / Sales Tax (%)': era.consumptionTaxRate,
      'Property & Local Taxes (%)': era.propertyAndLocalTaxRate,
      'Other Indirect & Stealth Taxes (%)': era.otherIndirectTaxesRate,
      'Total Effective Tax Burden (%)': era.totalEffectiveTaxBurdenRate,
      'Days Worked for Government': era.daysWorkedForGov,
      'Average Gross Wage': era.averageGrossWage,
      'Net Take-Home Pay': era.netTakeHomePay
    }));
  }, [marketData]);

  // Comparison across USD, GBP, EUR
  const crossMarketComparison = useMemo(() => {
    return [
      {
        market: 'United States (USD)',
        code: 'USD',
        symbol: '$',
        burden1971: TAX_VS_WAGES_DATA.USD.historicalEras[0].totalEffectiveTaxBurdenRate,
        burden2026: TAX_VS_WAGES_DATA.USD.historicalEras[6].totalEffectiveTaxBurdenRate,
        days1971: TAX_VS_WAGES_DATA.USD.historicalEras[0].daysWorkedForGov,
        days2026: TAX_VS_WAGES_DATA.USD.historicalEras[6].daysWorkedForGov,
        freedomDay2026: TAX_VS_WAGES_DATA.USD.historicalEras[6].taxFreedomDay,
        topVatSales: '6.5% – 10.5%',
        topMarginalRate: '37% + State'
      },
      {
        market: 'United Kingdom (GBP)',
        code: 'GBP',
        symbol: '£',
        burden1971: TAX_VS_WAGES_DATA.GBP.historicalEras[0].totalEffectiveTaxBurdenRate,
        burden2026: TAX_VS_WAGES_DATA.GBP.historicalEras[6].totalEffectiveTaxBurdenRate,
        days1971: TAX_VS_WAGES_DATA.GBP.historicalEras[0].daysWorkedForGov,
        days2026: TAX_VS_WAGES_DATA.GBP.historicalEras[6].daysWorkedForGov,
        freedomDay2026: TAX_VS_WAGES_DATA.GBP.historicalEras[6].taxFreedomDay,
        topVatSales: '20% VAT',
        topMarginalRate: '45% + 15% Emp NIC'
      },
      {
        market: 'Eurozone Average (EUR)',
        code: 'EUR',
        symbol: '€',
        burden1971: TAX_VS_WAGES_DATA.EUR.historicalEras[0].totalEffectiveTaxBurdenRate,
        burden2026: TAX_VS_WAGES_DATA.EUR.historicalEras[6].totalEffectiveTaxBurdenRate,
        days1971: TAX_VS_WAGES_DATA.EUR.historicalEras[0].daysWorkedForGov,
        days2026: TAX_VS_WAGES_DATA.EUR.historicalEras[6].daysWorkedForGov,
        freedomDay2026: TAX_VS_WAGES_DATA.EUR.historicalEras[6].taxFreedomDay,
        topVatSales: '19% – 22% VAT',
        topMarginalRate: '45% – 52%'
      }
    ];
  }, []);

  // SEO Structured Data (WebApplication, Dataset, FAQPage)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Historical Tax Burden vs. Wages Tracker (1971–2026)',
        description: 'Comprehensive historical analysis and interactive calculator tracking the total effective tax burden, fiscal drag bracket creep, and Tax Freedom Day across the USD, GBP, and Eurozone economies.',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        url: 'https://fiat-erosion-tracker.com/tax-vs-wages'
      },
      {
        '@type': 'Dataset',
        name: 'Historical Tax Rates vs Average Wages (USD, GBP, EUR 1971-2026)',
        description: 'Decade-by-decade historical data measuring income tax, payroll/social security contributions, VAT/sales tax, property tax, and total labor wedge on median wage earners.',
        creator: {
          '@type': 'Organization',
          name: 'Fiat Erosion Tracker Research'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: TAX_FAQS.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-orange-500 selection:text-white pb-24">
      {/* SEO HELMET */}
      <Helmet>
        <title>Tax Burden vs. Wages Tracker (1971–2026) | USD, GBP, EUR Historical Analysis</title>
        <meta 
          name="description" 
          content="Explore the historical rise of the tax burden on wages from 1971 to 2026. Calculate your true tax rate, fiscal drag impact, and Tax Freedom Day across USD, GBP, and EUR." 
        />
        <meta name="keywords" content="tax burden vs wages, historical tax rates, fiscal drag, bracket creep, tax freedom day, income tax history, VAT history, national insurance, UK stealth tax freeze, FICA tax history" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : 'https://fiat-erosion-tracker.com/tax-vs-wages'} />
        
        {/* OpenGraph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Tax Burden vs. Wages (1971–2026) | Historical Tax Rate Analysis" />
        <meta property="og:description" content="Calculate your true effective tax rate including income tax, payroll, VAT, property, and hidden stealth taxes across USD, GBP, and Eurozone." />
        <meta property="og:site_name" content="Fiat Erosion Tracker" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tax Burden vs. Wages: How Much Do You Really Pay?" />
        <meta name="twitter:description" content="Interactive historical analysis of fiscal drag, Tax Freedom Day, and the true tax wedge on working salaries from 1971 to 2026." />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/money-supply"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Landmark className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Money Supply</span>
            </Link>

            <Link
              to="/cost-vs-wages"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Cost vs Wages</span>
            </Link>

            <Link
              to="/bitcoin-sound-money"
              className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs font-semibold text-orange-400 hover:bg-orange-500/20 transition-colors flex items-center gap-1.5"
            >
              <Coins className="h-3.5 w-3.5 text-orange-400" />
              <span className="hidden sm:inline">Sound Money</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            Fiscal Drag & Labor Taxation
          </span>
          <span className="text-xs text-zinc-500">Historical Analysis: 1971 – 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Levels of Tax vs. Wages: <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300">
            The Historical Squeeze on Working Incomes
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed mb-8">
          Beyond consumer price inflation, working households face a secondary compounding squeeze: <strong className="text-zinc-200">Fiscal Drag</strong>, soaring payroll charges, 20% VAT/sales taxes, and exploding property levies. Explore how the total effective tax burden on average wages has grown since 1971 across the <strong className="text-white">USD</strong>, <strong className="text-white">GBP</strong>, and <strong className="text-white">Eurozone</strong> economies.
        </p>

        {/* MARKET CURRENCY SELECTOR TABS */}
        <div className="flex flex-wrap items-center gap-3 p-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 w-full sm:w-fit mb-10">
          <button
            onClick={() => handleMarketChange('GBP')}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
              selectedMarket === 'GBP'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span className="text-base">🇬🇧</span>
            <span>United Kingdom (GBP)</span>
            <span className="text-xs opacity-75 font-mono">£</span>
          </button>

          <button
            onClick={() => handleMarketChange('USD')}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
              selectedMarket === 'USD'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span className="text-base">🇺🇸</span>
            <span>United States (USD)</span>
            <span className="text-xs opacity-75 font-mono">$</span>
          </button>

          <button
            onClick={() => handleMarketChange('EUR')}
            className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer ${
              selectedMarket === 'EUR'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span className="text-base">🇪🇺</span>
            <span>Eurozone Average (EUR)</span>
            <span className="text-xs opacity-75 font-mono">€</span>
          </button>
        </div>

        {/* TOP LEVEL METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Card 1: Total Effective Tax Burden */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Total Tax Burden (2026)</span>
              <Percent className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-rose-400">
              {latestEra.totalEffectiveTaxBurdenRate}%
            </div>
            <p className="text-xs text-zinc-400">
              Up from <span className="font-semibold text-zinc-300">{era1971.totalEffectiveTaxBurdenRate}% in 1971</span> (direct income + payroll + VAT + local property).
            </p>
          </div>

          {/* Card 2: Tax Freedom Day */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Tax Freedom Day</span>
              <Calendar className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400">
              {latestEra.taxFreedomDay}
            </div>
            <p className="text-xs text-zinc-400">
              Workers labor <span className="font-semibold text-amber-300">{latestEra.daysWorkedForGov} days</span> each year just to pay government revenues ({era1971.daysWorkedForGov} days in 1971).
            </p>
          </div>

          {/* Card 3: Real Take-Home Retention */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Net Income Retained</span>
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">
              {(100 - latestEra.totalEffectiveTaxBurdenRate).toFixed(1)}%
            </div>
            <p className="text-xs text-zinc-400">
              Average wage earner keeps only <span className="font-semibold text-emerald-300">{marketData.symbol}{latestEra.netTakeHomePay.toLocaleString()}</span> of {marketData.symbol}{latestEra.averageGrossWage.toLocaleString()} gross earnings.
            </p>
          </div>

          {/* Card 4: Employer Tax Wedge */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span>Hidden Employer Wedge</span>
              <Building className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-blue-400">
              +{latestEra.employerPayrollTaxRate}%
            </div>
            <p className="text-xs text-zinc-400">
              Total labor cost to hire you is <span className="font-semibold text-blue-300">{marketData.symbol}{latestEra.totalLaborCost.toLocaleString()}</span> before your pay hits your account.
            </p>
          </div>
        </div>

        {/* INTERACTIVE PERSONAL TAX CALCULATOR */}
        <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl mb-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-widest mb-1">
                <Receipt className="h-4 w-4" />
                <span>Interactive Wage Simulation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Your Personal Tax Freedom & True Burden Calculator
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                See the full breakdown of direct, payroll, consumption (VAT), property, and hidden stealth taxes on your income in 2026.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs text-zinc-300 shrink-0">
              <input
                type="checkbox"
                id="toggleEmployer"
                checked={includeEmployerTaxes}
                onChange={(e) => setIncludeEmployerTaxes(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-700 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <label htmlFor="toggleEmployer" className="cursor-pointer font-medium">
                Include Employer Social Wedge ({latestEra.employerPayrollTaxRate}%)
              </label>
            </div>
          </div>

          {/* Calculator Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Annual Gross Salary / Income</span>
                <span className="text-rose-400 font-mono">
                  {marketData.symbol}{userGrossSalary.toLocaleString()}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                  {marketData.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={userGrossSalary}
                  onChange={(e) => setUserGrossSalary(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500 px-4 py-3 pl-8 rounded-xl text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setUserGrossSalary(selectedMarket === 'GBP' ? 25000 : selectedMarket === 'USD' ? 45000 : 35000)}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-400 font-medium cursor-pointer"
                >
                  Entry Wage
                </button>
                <button
                  onClick={() => setUserGrossSalary(selectedMarket === 'GBP' ? 38200 : selectedMarket === 'USD' ? 76500 : 54200)}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 font-medium cursor-pointer"
                >
                  National Average
                </button>
                <button
                  onClick={() => setUserGrossSalary(selectedMarket === 'GBP' ? 65000 : selectedMarket === 'USD' ? 125000 : 90000)}
                  className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 font-medium cursor-pointer"
                >
                  Higher Earner
                </button>
              </div>
            </div>

            {/* Quick Result 1: True Tax Burden */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                True Total Effective Tax Rate
              </div>
              <div className="text-3xl sm:text-4xl font-black text-rose-400 my-1">
                {personalCalc.trueEffectiveTaxRate.toFixed(1)}%
              </div>
              <div className="text-xs text-zinc-400">
                You surrender <strong className="text-rose-300">{marketData.symbol}{Math.round(personalCalc.totalTaxesWithEmployer).toLocaleString()}</strong> in total compulsory levies.
              </div>
            </div>

            {/* Quick Result 2: Personal Tax Freedom Day */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Your Personal Tax Freedom Day
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 my-1">
                {personalCalc.freedomDateStr}
              </div>
              <div className="text-xs text-zinc-400">
                You work <strong className="text-amber-300">{personalCalc.daysWorkedForGov} days</strong> for the government; only after {personalCalc.freedomDateStr} do you work for yourself.
              </div>
            </div>
          </div>

          {/* Breakdown Progress Bars & Categories */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
              Where Your Total Compensation ({marketData.symbol}{Math.round(personalCalc.totalEconomicCompensation).toLocaleString()}) Actually Goes:
            </h3>

            {/* Visual Stacked Bar */}
            <div className="h-6 w-full rounded-xl overflow-hidden flex bg-zinc-900 border border-zinc-800">
              <div
                style={{ width: `${(personalCalc.incomeTax / personalCalc.totalEconomicCompensation) * 100}%` }}
                className="bg-rose-500 hover:opacity-90 transition-all"
                title={`Income Tax: ${marketData.symbol}${Math.round(personalCalc.incomeTax).toLocaleString()}`}
              />
              <div
                style={{ width: `${(personalCalc.payrollTax / personalCalc.totalEconomicCompensation) * 100}%` }}
                className="bg-orange-500 hover:opacity-90 transition-all"
                title={`Employee Payroll: ${marketData.symbol}${Math.round(personalCalc.payrollTax).toLocaleString()}`}
              />
              {includeEmployerTaxes && (
                <div
                  style={{ width: `${(personalCalc.employerTax / personalCalc.totalEconomicCompensation) * 100}%` }}
                  className="bg-blue-600 hover:opacity-90 transition-all"
                  title={`Employer Social Wedge: ${marketData.symbol}${Math.round(personalCalc.employerTax).toLocaleString()}`}
                />
              )}
              <div
                style={{ width: `${(personalCalc.consumptionVat / personalCalc.totalEconomicCompensation) * 100}%` }}
                className="bg-amber-500 hover:opacity-90 transition-all"
                title={`VAT / Sales Tax: ${marketData.symbol}${Math.round(personalCalc.consumptionVat).toLocaleString()}`}
              />
              <div
                style={{ width: `${(personalCalc.localPropertyTax / personalCalc.totalEconomicCompensation) * 100}%` }}
                className="bg-purple-500 hover:opacity-90 transition-all"
                title={`Property / Local: ${marketData.symbol}${Math.round(personalCalc.localPropertyTax).toLocaleString()}`}
              />
              <div
                style={{ width: `${(personalCalc.indirectOther / personalCalc.totalEconomicCompensation) * 100}%` }}
                className="bg-pink-500 hover:opacity-90 transition-all"
                title={`Stealth / Duties: ${marketData.symbol}${Math.round(personalCalc.indirectOther).toLocaleString()}`}
              />
              <div
                style={{ width: `${(personalCalc.netTakeHome / personalCalc.totalEconomicCompensation) * 100}%` }}
                className="bg-emerald-500 hover:opacity-90 transition-all"
                title={`Net Kept: ${marketData.symbol}${Math.round(personalCalc.netTakeHome).toLocaleString()}`}
              />
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Direct Income Tax</span>
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  {marketData.symbol}{Math.round(personalCalc.incomeTax).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {((personalCalc.incomeTax / personalCalc.gross) * 100).toFixed(1)}% of gross
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-400">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span>Employee Payroll</span>
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  {marketData.symbol}{Math.round(personalCalc.payrollTax).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">
                  NICs / FICA / Social
                </div>
              </div>

              {includeEmployerTaxes && (
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <span>Employer Wedge</span>
                  </div>
                  <div className="text-base font-extrabold text-white font-mono">
                    {marketData.symbol}{Math.round(personalCalc.employerTax).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Hidden Labor Surcharge
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>VAT / Sales Tax</span>
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  {marketData.symbol}{Math.round(personalCalc.consumptionVat).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">
                  20% on retail spending
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Property & Local</span>
                </div>
                <div className="text-base font-extrabold text-white font-mono">
                  {marketData.symbol}{Math.round(personalCalc.localPropertyTax).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Council / Municipal
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Net Kept by You</span>
                </div>
                <div className="text-base font-extrabold text-emerald-400 font-mono">
                  {marketData.symbol}{Math.round(personalCalc.netTakeHome).toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">
                  {((personalCalc.netTakeHome / personalCalc.gross) * 100).toFixed(1)}% kept
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HISTORICAL CHARTS SECTION */}
        <section className="space-y-8 mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-widest mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Historical Evolution (1971–2026)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Evolution of Total Effective Tax Rates on Wages
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Source: OECD, Tax Foundation, IFS, ONS</span>
          </div>

          {/* Recharts Area Chart */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-300">
              Composition of Total Tax Burden on Average Worker (%)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="payrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="vatGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="localGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" stroke="#71717a" tick={{ fill: '#d4d4d8', fontSize: 12 }} />
                  <YAxis 
                    stroke="#71717a" 
                    tick={{ fill: '#d4d4d8', fontSize: 12 }} 
                    unit="%" 
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Income Tax (%)" stackId="1" stroke="#f43f5e" fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="Payroll / Social Security (%)" stackId="1" stroke="#f97316" fill="url(#payrollGrad)" />
                  <Area type="monotone" dataKey="VAT / Sales Tax (%)" stackId="1" stroke="#eab308" fill="url(#vatGrad)" />
                  <Area type="monotone" dataKey="Property & Local Taxes (%)" stackId="1" stroke="#a855f7" fill="url(#localGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-zinc-400 text-center">
              * Stacked area illustrates the cumulative percentage of average wage absorbed by each layer of government taxation over time.
            </p>
          </div>

          {/* Tax Freedom Day Progression Chart */}
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-300">
              Days Worked for the Government per Year (1971–2026)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="label" stroke="#71717a" tick={{ fill: '#d4d4d8', fontSize: 12 }} />
                  <YAxis 
                    stroke="#71717a" 
                    tick={{ fill: '#d4d4d8', fontSize: 12 }} 
                    domain={[80, 200]} 
                    tickFormatter={(val) => `${val}d`}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                    formatter={(value: any) => [`${value} days`, 'Days Worked for Gov']}
                  />
                  <Line
                    type="monotone"
                    dataKey="Days Worked for Government"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#fbbf24' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* DECADE-BY-DECADE HISTORICAL TABLE */}
        <section className="space-y-6 mb-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-widest mb-1">
                <FileSpreadsheet className="h-4 w-4" />
                <span>Historical Audit</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Historical Tax Milestones (1971–2026)
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-900/80 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-4">Year / Era</th>
                  <th className="py-4 px-4">Average Gross Wage</th>
                  <th className="py-4 px-4">Tax-Free Allowance</th>
                  <th className="py-4 px-4">Direct Income Tax %</th>
                  <th className="py-4 px-4">Payroll / NIC %</th>
                  <th className="py-4 px-4">VAT / Sales %</th>
                  <th className="py-4 px-4 text-rose-400">Total Effective Tax %</th>
                  <th className="py-4 px-4 text-amber-400">Tax Freedom Day</th>
                  <th className="py-4 px-4 text-emerald-400">Net Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {marketData.historicalEras.map((era) => (
                  <tr key={era.year} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-4 font-sans font-bold text-white whitespace-nowrap">
                      {era.label}
                    </td>
                    <td className="py-4 px-4 font-bold text-zinc-200">
                      {marketData.symbol}{era.averageGrossWage.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-zinc-400">
                      {marketData.symbol}{era.personalAllowanceOrStandardDeduction.toLocaleString()}
                      <span className="text-[10px] text-zinc-500 font-sans block">
                        ({era.personalAllowanceAsPercentOfWage}% of wage)
                      </span>
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      {era.averageIncomeTaxRate}%
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      {era.payrollTaxRate}%
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      {era.consumptionTaxRate}%
                    </td>
                    <td className="py-4 px-4 font-extrabold text-rose-400">
                      {era.totalEffectiveTaxBurdenRate}%
                    </td>
                    <td className="py-4 px-4 font-bold text-amber-400 whitespace-nowrap">
                      {era.taxFreedomDay} ({era.daysWorkedForGov}d)
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-400">
                      {marketData.symbol}{era.netTakeHomePay.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* COMPARATIVE ANALYSIS: USD VS GBP VS EUR */}
        <section className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 mb-16 space-y-6">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-widest">
            <Scale className="h-4 w-4" />
            <span>Cross-Market Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Comparing Tax Burden: US vs. UK vs. Eurozone
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crossMarketComparison.map((comp) => (
              <div 
                key={comp.code}
                className={`p-6 rounded-2xl border transition-all ${
                  selectedMarket === comp.code 
                    ? 'bg-rose-950/20 border-rose-500/40 ring-2 ring-rose-500/20' 
                    : 'bg-zinc-900/50 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-base text-white">{comp.market}</span>
                  <span className="text-xl">{comp.code === 'GBP' ? '🇬🇧' : comp.code === 'USD' ? '🇺🇸' : '🇪🇺'}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-zinc-800">
                    <span className="text-zinc-400">1971 Tax Burden:</span>
                    <span className="font-bold text-zinc-200">{comp.burden1971}% ({comp.days1971} days)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-800">
                    <span className="text-zinc-400">2026 Tax Burden:</span>
                    <span className="font-extrabold text-rose-400">{comp.burden2026}% ({comp.days2026} days)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-800">
                    <span className="text-zinc-400">2026 Tax Freedom Day:</span>
                    <span className="font-bold text-amber-400">{comp.freedomDay2026}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-zinc-800">
                    <span className="text-zinc-400">Consumption VAT/Sales:</span>
                    <span className="font-bold text-zinc-200">{comp.topVatSales}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-zinc-400">Top Marginal Rate:</span>
                    <span className="font-bold text-zinc-200">{comp.topMarginalRate}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleMarketChange(comp.code as MarketType)}
                  className="w-full mt-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-xs text-zinc-200 transition-colors cursor-pointer"
                >
                  View {comp.code} Deep Dive
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* IN-DEPTH EDUCATIONAL RESEARCH */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Fiscal Drag & Bracket Creep */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              <span>Silent Taxation</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {marketData.fiscalDragDetails.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {marketData.fiscalDragDetails.description}
            </p>
            <div className="space-y-2 pt-2">
              {marketData.fiscalDragDetails.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                  <span className="text-amber-400 font-bold mt-0.5">•</span>
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: The Double Squeeze (Inflation + Taxes) */}
          <div className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-widest">
              <AlertTriangle className="h-4 w-4" />
              <span>The Dual Squeeze</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Why Working Incomes Feel Permanently Squeezed
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Workers in the 21st century face a simultaneous pincer movement on their living standards:
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold mt-0.5">1.</span>
                <span><strong>Monetary Debasement (CPI Inflation):</strong> Central bank money supply growth forces up the cost of basic food, energy, and non-reproducible housing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold mt-0.5">2.</span>
                <span><strong>Fiscal Drag (Higher Tax Slices):</strong> Cost-of-living pay rises push nominal earnings into frozen tax brackets, meaning the state takes a larger percentage of your income even though your purchasing power has not grown.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold mt-0.5">3.</span>
                <span><strong>20% VAT on Everything:</strong> Every pound, dollar, or euro spent on higher-priced retail goods generates higher nominal sales tax revenues for the treasury.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="space-y-4 mb-16">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-extrabold uppercase tracking-widest">
            <HelpCircle className="h-4 w-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
            Taxation, Wages & Sound Money FAQs
          </h2>

          <div className="space-y-3">
            {TAX_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-rose-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-zinc-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed whitespace-pre-line border-t border-zinc-900 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CALL-TO-ACTION */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-zinc-800 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Coins className="h-8 w-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Escape the Fiat Debasement & Fiscal Drag Trap
          </h3>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            While fiat currencies are systematically inflated and tax brackets drag working wages higher into state treasuries, sound money assets like Bitcoin offer mathematically fixed scarcity that cannot be debased or diluted.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/bitcoin-sound-money"
              className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-sm text-white transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
            >
              <span>Explore Bitcoin as Sound Money</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/cost-vs-wages"
              className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 font-bold text-sm text-zinc-200 transition-all flex items-center gap-2"
            >
              <span>Cost vs. Wages & Hours Worked</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxVsWagesPage;
