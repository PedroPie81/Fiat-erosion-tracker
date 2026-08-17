import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Clock, DollarSign, TrendingUp, TrendingDown, Home, 
  GraduationCap, Car, Fuel, Egg, Shield, Coins, 
  HelpCircle, ChevronDown, ChevronUp, ArrowRight, 
  Sliders, Calendar, Calculator, Sparkles, Building, 
  HeartPulse, Wheat, Milk, Scale, AlertCircle, Info,
  CheckCircle2, ArrowUpRight, BarChart2, Layers
} from 'lucide-react';
import { 
  COST_VS_WAGES_DATA, 
  YEARS_LIST, 
  SupportedYear, 
  HistoricalCostItem 
} from '../data/costVsWagesData';

type CurrencyType = 'USD' | 'GBP' | 'EUR';
type CategoryFilter = 'all' | 'housing' | 'education_health' | 'transport_energy' | 'food_staples' | 'sound_assets';
type MetricDisplayMode = 'hours' | 'nominal' | 'wage_multiplier';

const FAQS = [
  {
    q: 'Why does beef and food cost 8x more in dollars today, but takes a similar amount of work hours as in 1971?',
    a: 'This demonstrates the crucial economic distinction between reproducible commodities and non-reproducible scarce assets:\n\n1. Agricultural Mechanization & Industrialization: Between 1971 and 2000, automated grain harvesting, industrial feedlots, genetic crop breeding, and massive government farm subsidies drastically reduced the physical resource cost of producing food. By 2000, 1 lb of beef required just 7.0 minutes of work (down from 11.6 minutes in 1971).\n\n2. Wage vs. Price Parity: Over 55 years, nominal hourly wages rose ~760% ($3.63/hr to $31.20/hr in the US), closely matching the ~735% nominal rise in beef ($0.70 to $5.85/lb). Massive industrial efficiency gains masked fiat debasement in reproducible groceries.\n\n3. The Contrast with Scarce Assets: In sharp contrast, you cannot mass-produce land, prime residential housing, Ivy League diplomas, or physical gold. Newly printed fiat money flooded into fixed-supply assets: buying a home went from ~6,942 hours of labor in 1971 to over 13,846 hours today (+99% labor increase), and gold went from 9.6 hours to 93 hours (+869% labor increase).'
  },
  {
    q: 'Why do everyday essentials and housing feel so unaffordable despite nominal wage increases?',
    a: 'While nominal hourly wages have risen in currency terms over recent decades, the cost of scarce, non-reproducible assets and essential services—particularly housing, healthcare, and higher education—has expanded at many times the rate of wages. Because central banks continuously expand the fiat money supply, newly created money floods into fixed-supply assets, requiring workers to sacrifice significantly more hours of physical labor to buy the exact same standard of living.'
  },
  {
    q: 'What is the "WTF Happened in 1971?" phenomenon shown in this data?',
    a: 'In August 1971, US President Richard Nixon terminated the convertibility of the US dollar into physical gold (the Nixon Shock), permanently ending the Bretton Woods monetary system. From that point onward, every major global currency became unbacked fiat. Historical economic data shows that starting in 1971, worker compensation decoupled from worker productivity: productivity continued rising with technology, but real hourly purchasing power stagnated while asset prices exploded.'
  },
  {
    q: 'How many hours of work were needed to buy a house in 1971 vs. today?',
    a: 'In 1971 in the United States, the median home cost ~$25,200 while average hourly compensation was ~$3.63, meaning an average worker needed approximately 6,942 hours of labor (~3.4 years of full-time work) to purchase a home. By 2026, with the median home at ~$432,000 and average hourly wages at ~$31.20, it requires over 13,846 hours of labor (~6.9 years of full-time work)—more than doubling the labor required to achieve homeownership.'
  },
  {
    q: 'Why have consumer electronics gotten cheaper in labor hours while housing and college tuition exploded?',
    a: 'Manufactured consumer goods like flat-screen televisions, computers, and microchips benefit from deflationary technological advancement, robotic automation, and globalized supply chains. In contrast, assets with strict supply limits (land/housing in desirable locations) or sectors bloated with federally subsidized debt (higher education, healthcare) cannot be cheaply mass-produced, making them prime absorbents of fiat monetary debasement.'
  },
  {
    q: 'How does measuring the price of goods in Gold or Bitcoin provide a clearer picture than fiat money?',
    a: 'Fiat currency is an elastic measuring stick that constantly expands, making all goods appear to "go up in price." When prices of houses, oil, or food are priced against an inelastic sound money baseline like physical Gold or Bitcoin, their real cost has remained remarkably stable or even dropped over the long term. This proves that high consumer prices are a consequence of fiat currency debasement, not goods becoming inherently scarcer.'
  }
];

const CostVsWagesPage: React.FC = () => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [baseYear, setBaseYear] = useState<SupportedYear>(1971);
  const [targetYear, setTargetYear] = useState<SupportedYear>(2026);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [displayMode, setDisplayMode] = useState<MetricDisplayMode>('hours');
  const [customHourlyWage, setCustomHourlyWage] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const dataset = COST_VS_WAGES_DATA[currency];
  const baseWageData = dataset.wages[baseYear];
  const targetWageData = dataset.wages[targetYear];

  // Active hourly wage to use for personalized calculation
  const effectiveTargetHourlyWage = customHourlyWage > 0 
    ? customHourlyWage 
    : targetWageData.averageHourlyWage;

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return dataset.items;
    return dataset.items.filter(item => item.category === categoryFilter);
  }, [dataset, categoryFilter]);

  // Helper to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'housing': return <Home className="h-4 w-4 text-amber-400" />;
      case 'education_health': return <GraduationCap className="h-4 w-4 text-blue-400" />;
      case 'transport_energy': return <Car className="h-4 w-4 text-emerald-400" />;
      case 'food_staples': return <Wheat className="h-4 w-4 text-rose-400" />;
      case 'sound_assets': return <Coins className="h-4 w-4 text-[#f97316]" />;
      default: return <Building className="h-4 w-4 text-zinc-400" />;
    }
  };

  // Format currency helpers
  const formatMoney = (val: number) => {
    if (val >= 1000) {
      return `${dataset.symbol}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
    return `${dataset.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatHours = (hours: number) => {
    if (hours >= 1000) {
      return `${Math.round(hours).toLocaleString()} hrs`;
    }
    if (hours >= 10) {
      return `${hours.toFixed(1)} hrs`;
    }
    if (hours >= 1) {
      const whole = Math.floor(hours);
      const mins = Math.round((hours - whole) * 60);
      return mins > 0 ? `${whole}h ${mins}m` : `${whole} hrs`;
    }
    // Sub-hour items (< 1 hour)
    const mins = hours * 60;
    if (mins < 1) {
      const secs = Math.round(hours * 3600);
      return `${secs} secs`;
    }
    return `${mins.toFixed(1)} mins (${hours.toFixed(2)}h)`;
  };

  const formatTableHours = (hours: number) => {
    if (hours >= 1000) {
      return `${Math.round(hours).toLocaleString()} hrs`;
    }
    if (hours >= 10) {
      return `${hours.toFixed(1)} hrs`;
    }
    if (hours >= 1) {
      const whole = Math.floor(hours);
      const mins = Math.round((hours - whole) * 60);
      return mins > 0 ? `${whole}h ${mins}m` : `${whole}h`;
    }
    // Sub-hour items (< 1 hour)
    const mins = hours * 60;
    return `${mins.toFixed(1)} mins`;
  };

  const formatDaysOrYears = (hours: number) => {
    if (hours >= 2000) {
      const years = (hours / 2000).toFixed(1);
      return `~${years} full work years (2,000h/yr)`;
    }
    if (hours >= 8) {
      const days = (hours / 8).toFixed(1);
      return `~${days} work days (8h/day)`;
    }
    if (hours >= 1) {
      const whole = Math.floor(hours);
      const mins = Math.round((hours - whole) * 60);
      return mins > 0 ? `${whole} hr ${mins} min of labor` : `${whole} hr of labor`;
    }
    const mins = (hours * 60).toFixed(1);
    return `~${mins} minutes of labor`;
  };

  // Macro Summary Statistics
  const homeItem = dataset.items.find(i => i.id === 'median_home');
  const tuitionItem = dataset.items.find(i => i.id === 'college_tuition');
  const goldItem = dataset.items.find(i => i.id === 'gold_ounce');

  const baseHomeHours = homeItem ? homeItem.prices[baseYear] / baseWageData.averageHourlyWage : 0;
  const targetHomeHours = homeItem ? homeItem.prices[targetYear] / effectiveTargetHourlyWage : 0;
  const homeHoursChange = baseHomeHours > 0 ? ((targetHomeHours - baseHomeHours) / baseHomeHours) * 100 : 0;

  const baseGoldHours = goldItem ? goldItem.prices[baseYear] / baseWageData.averageHourlyWage : 0;
  const targetGoldHours = goldItem ? goldItem.prices[targetYear] / effectiveTargetHourlyWage : 0;
  const goldHoursChange = baseGoldHours > 0 ? ((targetGoldHours - baseGoldHours) / baseGoldHours) * 100 : 0;

  // JSON-LD Structured Data Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Cost of Living vs. Wages & Labor Hours: Historical Purchasing Power Tracker (1971-2026)",
    "description": "Interactive historical analysis tracking the true cost of housing, education, healthcare, food, and assets measured in hours of human labor vs. fiat wages in USD, GBP, and EUR.",
    "author": {
      "@type": "Person",
      "name": "Peter Adam J"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fiat Erosion Tracker"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://fiat-erosion-tracker.com/cost-vs-wages"
    },
    "keywords": "cost of living vs wages, hours of work to buy a house, fiat currency erosion, real wages vs inflation, purchasing power labor hours, cost of things vs wages, nixon shock 1971 wages, gold vs wages historical",
    "about": [
      { "@type": "Thing", "name": "Cost of Living" },
      { "@type": "Thing", "name": "Real Wages" },
      { "@type": "Thing", "name": "Fiat Currency Erosion" },
      { "@type": "Thing", "name": "Purchasing Power" },
      { "@type": "Thing", "name": "Inflation" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>Cost of Living vs. Wages & Labor Hours (1971–2026) | Fiat Erosion Tracker</title>
        <meta 
          name="description" 
          content="Explore how many hours of work were needed to buy a house, a car, groceries, college tuition, and gold from 1971 to 2026. Interactive historical comparison in USD, GBP, and EUR." 
        />
        <meta 
          name="keywords" 
          content="cost of living vs wages, cost of things vs hours worked, hours of work to buy a house, fiat currency erosion, real wages vs inflation, purchasing power historical data, USD GBP EUR wage comparisons" 
        />
        <meta property="og:title" content="Cost of Living vs. Wages & Hours Worked (1971–2026)" />
        <meta property="og:description" content="Calculate how many hours of human labor are required to afford life essentials today versus 1971 across USD, GBP, and EUR." />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      {/* Container */}
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
        
        {/* Top Header & Breadcrumb */}
        <div>
          {/* Navigation Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-xs uppercase tracking-widest text-zinc-500 font-bold">
            <Link to="/" className="text-[#f97316] hover:underline flex items-center gap-1.5">
              &larr; Fiat Erosion Tracker
            </Link>
            <span>/</span>
            <span className="text-zinc-400">Cost of Living vs. Wages & Labor Hours</span>
          </div>

          {/* Hero Header */}
          <header className="bg-zinc-900/40 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xl backdrop-blur-sm">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -top-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Top Bar: Category Tag & Currency Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold uppercase tracking-widest text-[#f97316]">
                <Clock className="h-3.5 w-3.5" /> Labor Purchasing Power & Real Wage Analytics
              </div>

              {/* Currency Selector Buttons */}
              <div className="flex items-center bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
                <span className="text-[11px] font-bold text-zinc-500 uppercase px-2 hidden sm:inline">Currency:</span>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    currency === 'USD' 
                      ? 'bg-[#f97316] text-white shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  💵 USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('GBP')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    currency === 'GBP' 
                      ? 'bg-[#f97316] text-white shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  💷 GBP (£)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('EUR')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    currency === 'EUR' 
                      ? 'bg-[#f97316] text-white shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  💶 EUR (€)
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 leading-[1.15]">
              The True Cost of Living: <span className="text-[#f97316]">Cost of Things vs. Wages</span> & Hours Worked
            </h1>
            
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-4xl mb-10">
              When prices are measured in constantly inflating fiat currency, everything appears to rise in nominal currency value. But when measured in the <strong className="text-white font-semibold">hours of human labor</strong> required to purchase life’s essentials, we expose the relentless reality of <strong className="text-[#f97316] font-semibold">fiat currency erosion</strong>.
            </p>

            {/* Quick Macro Insight Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 border-t border-zinc-800/80">
              <div className="bg-zinc-950/80 p-5 sm:p-6 rounded-2xl border border-zinc-800/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase text-zinc-400 font-bold flex items-center gap-2 mb-2">
                    <Home className="h-4 w-4 text-amber-400" /> Median House Labor Cost
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2.5 my-1">
                    {Math.round(targetHomeHours).toLocaleString()} hrs
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                      +{homeHoursChange.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-900">
                  Required {Math.round(baseHomeHours).toLocaleString()} hrs in {baseYear} ({formatDaysOrYears(targetHomeHours)})
                </div>
              </div>

              <div className="bg-zinc-950/80 p-5 sm:p-6 rounded-2xl border border-zinc-800/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase text-zinc-400 font-bold flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" /> Median Wage ({currency})
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono my-1">
                    {formatMoney(targetWageData.medianAnnualWage)}/yr
                  </div>
                </div>
                <div className="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-900">
                  Avg: {formatMoney(targetWageData.averageHourlyWage)}/hr (vs {formatMoney(baseWageData.averageHourlyWage)}/hr in {baseYear})
                </div>
              </div>

              <div className="bg-zinc-950/80 p-5 sm:p-6 rounded-2xl border border-zinc-800/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="text-[11px] uppercase text-zinc-400 font-bold flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-[#f97316]" /> 1 oz Physical Gold (XAU)
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono flex items-center gap-2.5 my-1">
                    {targetGoldHours.toFixed(1)} hrs
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      +{goldHoursChange.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-zinc-400 mt-3 pt-3 border-t border-zinc-900">
                  Required {baseGoldHours.toFixed(1)} hrs in {baseYear}
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Interactive Comparison & Filter Control Bar */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-zinc-800/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
                <Sliders className="h-5 w-5 text-[#f97316]" /> Customize Your Era & Parameters
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Select your baseline decade, comparison target year, and viewing perspective:
              </p>
            </div>

            {/* Decade Selectors */}
            <div className="flex flex-wrap items-center gap-3 bg-zinc-950/80 p-2 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2 px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Baseline:</span>
                <select
                  value={baseYear}
                  onChange={(e) => setBaseYear(Number(e.target.value) as SupportedYear)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] cursor-pointer"
                >
                  {YEARS_LIST.filter(y => y < targetYear).map(year => (
                    <option key={year} value={year}>{year} ({dataset.wages[year].label})</option>
                  ))}
                </select>
              </div>

              <span className="text-zinc-600 font-bold hidden sm:inline">&rarr;</span>

              <div className="flex items-center gap-2 px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Compare To:</span>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value) as SupportedYear)}
                  className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] cursor-pointer"
                >
                  {YEARS_LIST.filter(y => y > baseYear).map(year => (
                    <option key={year} value={year}>{year} ({dataset.wages[year].label})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Personalized Wage Calculator & Display Metric Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-8 items-start">
            
            {/* Custom Hourly Wage Input */}
            <div className="bg-zinc-950/90 p-5 sm:p-6 rounded-2xl border border-zinc-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-[#f97316]" /> 
                  Personalize with Your Hourly Wage ({dataset.symbol}/hr):
                </label>
                {customHourlyWage > 0 && (
                  <button 
                    onClick={() => setCustomHourlyWage(0)}
                    className="text-[11px] text-[#f97316] hover:underline uppercase font-bold cursor-pointer"
                  >
                    Reset to Average
                  </button>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                    {dataset.symbol}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    placeholder={`e.g. ${targetWageData.averageHourlyWage.toFixed(2)} (National Avg)`}
                    value={customHourlyWage || ''}
                    onChange={(e) => setCustomHourlyWage(Number(e.target.value))}
                    className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#f97316]"
                  />
                </div>
                <div className="text-xs text-zinc-400 bg-zinc-900/60 px-3 py-2 rounded-xl border border-zinc-800/60 font-medium">
                  {customHourlyWage > 0 
                    ? `Estimated: ~${formatMoney(customHourlyWage * 2000)}/yr` 
                    : `Average: ${formatMoney(targetWageData.averageHourlyWage)}/hr`}
                </div>
              </div>
            </div>

            {/* Display Mode Switcher */}
            <div className="bg-zinc-950/90 p-5 sm:p-6 rounded-2xl border border-zinc-800/90 space-y-3">
              <span className="text-xs sm:text-sm font-bold text-zinc-200 block uppercase tracking-wider">
                Display Metric Perspective:
              </span>
              <div className="grid grid-cols-3 gap-2 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setDisplayMode('hours')}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    displayMode === 'hours' 
                      ? 'bg-[#f97316] text-white shadow' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ⏱️ Labor Hours
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('nominal')}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    displayMode === 'nominal' 
                      ? 'bg-[#f97316] text-white shadow' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  💵 Nominal Price
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('wage_multiplier')}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                    displayMode === 'wage_multiplier' 
                      ? 'bg-[#f97316] text-white shadow' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  📊 % Annual Wage
                </button>
              </div>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
              <span className="text-[11px] uppercase font-bold text-zinc-500 shrink-0 mr-1">Filter Category:</span>
              
              <button
                onClick={() => setCategoryFilter('all')}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  categoryFilter === 'all' 
                    ? 'bg-zinc-100 text-zinc-950 shadow' 
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                All Items ({dataset.items.length})
              </button>

              <button
                onClick={() => setCategoryFilter('housing')}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === 'housing' 
                    ? 'bg-amber-500 text-zinc-950 shadow' 
                    : 'bg-zinc-950 text-amber-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Home className="h-3.5 w-3.5" /> Housing & Shelter
              </button>

              <button
                onClick={() => setCategoryFilter('education_health')}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === 'education_health' 
                    ? 'bg-blue-500 text-white shadow' 
                    : 'bg-zinc-950 text-blue-400 hover:text-white border border-zinc-800'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" /> Education & Healthcare
              </button>

              <button
                onClick={() => setCategoryFilter('transport_energy')}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === 'transport_energy' 
                    ? 'bg-emerald-500 text-zinc-950 shadow' 
                    : 'bg-zinc-950 text-emerald-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Car className="h-3.5 w-3.5" /> Transport & Fuel
              </button>

              <button
                onClick={() => setCategoryFilter('food_staples')}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === 'food_staples' 
                    ? 'bg-rose-500 text-white shadow' 
                    : 'bg-zinc-950 text-rose-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Wheat className="h-3.5 w-3.5" /> Groceries & Food
              </button>

              <button
                onClick={() => setCategoryFilter('sound_assets')}
                className={`shrink-0 px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  categoryFilter === 'sound_assets' 
                    ? 'bg-[#f97316] text-white shadow' 
                    : 'bg-zinc-950 text-[#f97316] hover:text-white border border-zinc-800'
                }`}
              >
                <Coins className="h-3.5 w-3.5" /> Sound Assets (Gold & BTC)
              </button>
            </div>
          </div>

        </section>

        {/* Main Comparison Grid of Items */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#f97316] mb-1">
                Evaluation Matrix
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Historical Cost vs. Labor Hours ({baseYear} vs. {targetYear})
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Comparing labor hours required under average hourly wage of {formatMoney(baseWageData.averageHourlyWage)} in {baseYear} vs. {formatMoney(effectiveTargetHourlyWage)} in {targetYear}.
              </p>
            </div>
            <div className="text-xs text-zinc-500 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-800">
              Showing {filteredItems.length} items
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredItems.map((item) => {
              const basePrice = item.prices[baseYear];
              const targetPrice = item.prices[targetYear];

              // Skip items not existing in base year (like Bitcoin in 1971)
              const hasBasePrice = basePrice > 0;
              const hasTargetPrice = targetPrice > 0;

              const baseHours = hasBasePrice ? basePrice / baseWageData.averageHourlyWage : 0;
              const targetHours = hasTargetPrice ? targetPrice / effectiveTargetHourlyWage : 0;

              const hoursPercentChange = hasBasePrice && baseHours > 0 
                ? ((targetHours - baseHours) / baseHours) * 100 
                : 0;

              const baseWageRatio = hasBasePrice ? (basePrice / baseWageData.medianAnnualWage) * 100 : 0;
              const targetWageRatio = hasTargetPrice ? (targetPrice / targetWageData.medianAnnualWage) * 100 : 0;

              const nominalPriceIncrease = hasBasePrice && basePrice > 0 
                ? ((targetPrice - basePrice) / basePrice) * 100 
                : 0;

              const isMoreExpensiveInLabor = hoursPercentChange > 0;

              return (
                <div 
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 rounded-3xl p-6 sm:p-8 transition-all flex flex-col justify-between shadow-xl group space-y-6"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 shrink-0">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg sm:text-xl text-white group-hover:text-[#f97316] transition-colors leading-tight">
                            {item.name}
                          </h3>
                          <span className="text-xs text-zinc-400 font-medium mt-0.5 block">
                            {item.unit} • <span className="text-zinc-500">{item.categoryLabel}</span>
                          </span>
                        </div>
                      </div>

                      {hasBasePrice && (
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border shrink-0 ${
                          hoursPercentChange > 10 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : hoursPercentChange < -10
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}>
                          {Math.abs(hoursPercentChange) < 0.5 
                            ? '0% labor (flat)' 
                            : hoursPercentChange > 0 
                            ? `+${hoursPercentChange >= 10 ? hoursPercentChange.toFixed(0) : hoursPercentChange.toFixed(1)}% labor` 
                            : `${hoursPercentChange <= -10 ? hoursPercentChange.toFixed(0) : hoursPercentChange.toFixed(1)}% labor`}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Display Data View Switch */}
                    {displayMode === 'hours' && (
                      <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                        <div className="space-y-1">
                          <div className="text-[11px] uppercase font-bold text-zinc-400">{baseYear} Labor Required</div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-zinc-300">
                            {hasBasePrice ? formatHours(baseHours) : 'N/A'}
                          </div>
                          {hasBasePrice && (
                            <div className="text-[11px] text-zinc-400">
                              {formatDaysOrYears(baseHours)}
                            </div>
                          )}
                        </div>

                        <div className="border-l border-zinc-800/90 pl-4 space-y-1">
                          <div className="text-[11px] uppercase font-bold text-zinc-400">{targetYear} Labor Required</div>
                          <div className={`text-xl sm:text-2xl font-black font-mono ${isMoreExpensiveInLabor ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {hasTargetPrice ? formatHours(targetHours) : 'N/A'}
                          </div>
                          {hasTargetPrice && (
                            <div className="text-[11px] text-zinc-300 font-medium">
                              {formatDaysOrYears(targetHours)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {displayMode === 'nominal' && (
                      <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                        <div className="space-y-1">
                          <div className="text-[11px] uppercase font-bold text-zinc-400">{baseYear} Nominal Price</div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-zinc-300">
                            {hasBasePrice ? formatMoney(basePrice) : 'N/A'}
                          </div>
                        </div>

                        <div className="border-l border-zinc-800/90 pl-4 space-y-1">
                          <div className="text-[11px] uppercase font-bold text-zinc-400">{targetYear} Nominal Price</div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-[#f97316]">
                            {hasTargetPrice ? formatMoney(targetPrice) : 'N/A'}
                          </div>
                          {hasBasePrice && (
                            <div className="text-[11px] text-rose-400 font-bold">
                              +{nominalPriceIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 })}% nominal rise
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {displayMode === 'wage_multiplier' && (
                      <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                        <div className="space-y-1">
                          <div className="text-[11px] uppercase font-bold text-zinc-400">{baseYear} % Annual Wage</div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-zinc-300">
                            {hasBasePrice ? `${baseWageRatio.toFixed(1)}%` : 'N/A'}
                          </div>
                          {hasBasePrice && (
                            <div className="text-[11px] text-zinc-400">
                              {(basePrice / baseWageData.medianAnnualWage).toFixed(2)}x annual salary
                            </div>
                          )}
                        </div>

                        <div className="border-l border-zinc-800/90 pl-4 space-y-1">
                          <div className="text-[11px] uppercase font-bold text-zinc-400">{targetYear} % Annual Wage</div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                            {hasTargetPrice ? `${targetWageRatio.toFixed(1)}%` : 'N/A'}
                          </div>
                          {hasTargetPrice && (
                            <div className="text-[11px] text-zinc-300 font-medium">
                              {(targetPrice / targetWageData.medianAnnualWage).toFixed(2)}x annual salary
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Progress Visual Bar for Labor Hours */}
                    {hasBasePrice && hasTargetPrice && (
                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between text-xs text-zinc-400 font-mono">
                          <span>{baseYear}: {formatHours(baseHours)}</span>
                          <span className="font-bold text-white">{targetYear}: {formatHours(targetHours)}</span>
                        </div>
                        <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                          <div 
                            style={{ width: `${Math.min(100, Math.max(10, (baseHours / Math.max(baseHours, targetHours)) * 100))}%` }}
                            className="h-full bg-zinc-600 rounded-full"
                          />
                          <div 
                            style={{ width: `${Math.min(100, Math.max(0, ((targetHours - baseHours) / Math.max(baseHours, targetHours)) * 100))}%` }}
                            className={`h-full ${hoursPercentChange > 0 ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full`}
                          />
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Footnote / Context */}
                  {item.notes && (
                    <div className="pt-4 border-t border-zinc-900 text-xs text-zinc-400 flex items-start gap-2 italic">
                      <Info className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span>{item.notes}</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Complete Historical Timeline Table */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f97316] mb-2">
            <BarChart2 className="h-4 w-4" /> Full Multi-Decade Timeline
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Historical Wage & Cost Evolution (1971–2026) in {currency}
          </h2>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-3xl">
            Examine how median salaries and core life essentials have transformed across every major decade in {dataset.name}. All prices and wages are sourced from official statistical bodies:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/80">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">Item / Metric</th>
                  {YEARS_LIST.map(year => (
                    <th key={year} className="py-4 px-5 font-mono text-right">
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                
                {/* Median Annual Wage */}
                <tr className="bg-orange-950/20 text-[#f97316] font-bold">
                  <td className="py-4 px-5 font-sans flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Median Annual Wage
                  </td>
                  {YEARS_LIST.map(year => (
                    <td key={year} className="py-4 px-5 text-right font-black">
                      {formatMoney(dataset.wages[year].medianAnnualWage)}
                    </td>
                  ))}
                </tr>

                {/* Average Hourly Wage */}
                <tr className="bg-orange-950/10 text-orange-300 font-bold">
                  <td className="py-4 px-5 font-sans flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Average Hourly Wage
                  </td>
                  {YEARS_LIST.map(year => (
                    <td key={year} className="py-4 px-5 text-right font-black">
                      {formatMoney(dataset.wages[year].averageHourlyWage)}/hr
                    </td>
                  ))}
                </tr>

                {/* Items */}
                {dataset.items.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3.5 px-5 font-sans text-zinc-200 font-medium flex items-center gap-2.5">
                      {getCategoryIcon(item.category)}
                      <span className="truncate max-w-[220px] font-semibold">{item.name}</span>
                    </td>
                    {YEARS_LIST.map(year => {
                      const price = item.prices[year];
                      if (!price || price === 0) {
                        return <td key={year} className="py-3.5 px-5 text-right text-zinc-600">—</td>;
                      }
                      const hours = price / dataset.wages[year].averageHourlyWage;
                      return (
                        <td key={year} className="py-3.5 px-5 text-right text-zinc-300">
                          <div className="font-semibold">{formatMoney(price)}</div>
                          <div className="text-[10px] text-zinc-400 font-medium">
                            {formatTableHours(hours)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400 flex flex-wrap justify-between gap-3">
            <span>Sources: {dataset.sources.join(' • ')}</span>
            <span>Historical figures normalized to official national statistical baselines.</span>
          </div>
        </section>

        {/* Section 3: "WTF Happened in 1971?" Economic Deep Dive */}
        <section className="bg-gradient-to-br from-amber-950/20 via-zinc-900/60 to-zinc-950 border border-amber-900/40 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            <Scale className="h-4 w-4" /> Monetary History & The Cantillon Effect
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">
            "WTF Happened in 1971?" Why Wages Decoupled from Living Costs
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8 max-w-4xl">
            Prior to August 15, 1971, the world’s financial system was anchored to gold under the Bretton Woods agreement. Money could not be printed without a corresponding physical reserve of gold. When that gold peg was severed by executive decree, governments gained the unchecked ability to expand the fiat money supply infinitely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-zinc-950/90 border border-zinc-800/90 p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-base text-[#f97316]">
                1. Productivity vs. Compensation
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                From 1948 to 1971, worker productivity and real hourly wages grew in lockstep at ~91%. Since 1971, productivity continued rising (+240%), while average hourly real compensation virtually stagnated (+115%), funneling gains to capital owners.
              </p>
            </div>

            <div className="bg-zinc-950/90 border border-zinc-800/90 p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-base text-amber-400">
                2. The Dual-Income Necessity
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                In 1971, a single median earner could comfortably buy a house, raise children, and own a family car on ~40 hours of weekly labor. Today, maintaining the same standard of living requires dual-income households working 80+ collective hours.
              </p>
            </div>

            <div className="bg-zinc-950/90 border border-zinc-800/90 p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-white text-base text-emerald-400">
                3. Asset Inflation vs. CPI Distortion
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Official Consumer Price Index (CPI) metrics use geometric weighting, substitution math, and owner's equivalent rent to suppress reported inflation, masking the explosive real price growth of housing, healthcare, and higher education.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-zinc-800/80">
            <Link 
              to="/bitcoin-sound-money" 
              className="w-full sm:w-auto px-8 py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold rounded-xl transition-all shadow-lg text-center text-sm"
            >
              Read Why Bitcoin is Sound Money & A Hedge &rarr;
            </Link>
            <Link 
              to="/case-studies" 
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-bold rounded-xl border border-zinc-700 transition-all text-center text-sm"
            >
              Explore Historical Currency Collapses (Weimar, Rome)
            </Link>
          </div>
        </section>

        {/* Section 4: Collapsible SEO FAQ */}
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-8">
            Cost of Living vs. Wages & Labor Hours FAQ
          </h2>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 hover:bg-zinc-900/40 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-[#f97316] shrink-0" /> : <ChevronDown className="h-5 w-5 text-zinc-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="p-6 pt-0 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Interlink Navigation Footer */}
        <footer className="pt-10 border-t border-zinc-800/80 flex flex-wrap justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex flex-wrap gap-4 font-semibold">
            <Link to="/" className="hover:text-white transition-colors">Fiat Erosion Calculator</Link>
            <Link to="/bitcoin-sound-money" className="hover:text-white transition-colors">Bitcoin Sound Money</Link>
            <Link to="/case-studies" className="hover:text-white transition-colors">Historical Case Studies</Link>
            <Link to="/history" className="hover:text-white transition-colors">History of Money</Link>
            <Link to="/inflation" className="hover:text-white transition-colors">What Is Inflation?</Link>
            <Link to="/cbdc" className="hover:text-white transition-colors">CBDC Control Risks</Link>
            <Link to="/bitcoin-wallets" className="hover:text-white transition-colors">Top 100 Bitcoin Wallets</Link>
          </div>
          <div>
            © 2026 Peter Adam J (@Peteradamj) • Fiat Erosion Tracker
          </div>
        </footer>

      </div>
    </div>
  );
};

export default CostVsWagesPage;
