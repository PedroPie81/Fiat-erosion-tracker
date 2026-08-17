import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip as RechartsTooltip, CartesianGrid, Legend, Line
} from 'recharts';
import { 
  Coins, TrendingUp, AlertTriangle, ShieldCheck, 
  HelpCircle, ChevronDown, ChevronUp, ArrowUpRight, DollarSign,
  Layers, Landmark, Flame, Sparkles, Scale, Info, Share2,
  Calendar, RefreshCw, BarChart3, Globe, Calculator, PieChart
} from 'lucide-react';
import HeaderNavDropdown from '../components/HeaderNavDropdown';
import { 
  MONEY_SUPPLY_DATA, 
  MONEY_SUPPLY_FAQS, 
  CurrencyMoneySupplyConfig 
} from '../data/moneySupplyData';

export const MoneySupplyPage: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'GBP' | 'EUR' | 'GLOBAL'>('USD');
  const [activeLayers, setActiveLayers] = useState<{
    m0: boolean;
    m1: boolean;
    m2: boolean;
    m3: boolean;
    centralBankAssets: boolean;
    btcOverlay: boolean;
  }>({
    m0: true,
    m1: true,
    m2: true,
    m3: true,
    centralBankAssets: true,
    btcOverlay: false
  });
  const [useLogScale, setUseLogScale] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Dilution Calculator State
  const [calcYear, setCalcYear] = useState<number>(1971);
  const [calcAmount, setCalcAmount] = useState<number>(10000);

  const currentConfig: CurrencyMoneySupplyConfig = MONEY_SUPPLY_DATA[selectedCurrency];
  const chartData = currentConfig.data;

  // Base and Current Points
  const basePoint = chartData[0]; // 1971
  const currentPoint = chartData[chartData.length - 1]; // 2026
  const point2000 = chartData.find(d => d.year === 2000) || chartData[3];
  const point2020 = chartData.find(d => d.year === 2020) || chartData[7];

  // Multipliers & Growth stats
  const m2MultiplierSince1971 = (currentPoint.m2 / basePoint.m2).toFixed(1);
  const m2PctSince1971 = (((currentPoint.m2 - basePoint.m2) / basePoint.m2) * 100).toFixed(0);

  const m2MultiplierSince2000 = (currentPoint.m2 / point2000.m2).toFixed(1);
  const m2PctSince2000 = (((currentPoint.m2 - point2000.m2) / point2000.m2) * 100).toFixed(0);

  const assetsMultiplier = (currentPoint.centralBankAssets / basePoint.centralBankAssets).toFixed(1);
  const assetsPct = (((currentPoint.centralBankAssets - basePoint.centralBankAssets) / basePoint.centralBankAssets) * 100).toFixed(0);

  // Dilution Calculator computations
  const selectedYearData = chartData.find(d => d.year === calcYear) || basePoint;
  const historicM2 = selectedYearData.m2;
  const currentM2 = currentPoint.m2;
  
  // Ratio of supply held back then
  const shareOfTotalMoneySupply = (calcAmount / (historicM2 * (currentConfig.baseUnit === 'billion' ? 1e9 : 1e12))) * 100;
  // What amount of currency would be needed today to have the exact same share of M2
  const equivalentAmountToday = calcAmount * (currentM2 / historicM2);
  const dilutionLossPercentage = ((1 - (calcAmount / equivalentAmountToday)) * 100).toFixed(1);

  const formatCurrencyValue = (val: number) => {
    if (currentConfig.baseUnit === 'trillion') {
      return `${currentConfig.symbol}${val.toFixed(1)}T`;
    }
    if (val >= 1000) {
      return `${currentConfig.symbol}${(val / 1000).toFixed(2)}T`;
    }
    return `${currentConfig.symbol}${val.toLocaleString()}B`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Global Money Supply Tracker (M0, M1, M2, M3, M4)',
        text: 'See how central banks expanded M0, M1, M2, and M3 broad money supply from 1971 to 2026 across USD, GBP, EUR, and Global economies.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Structured Data Schema.org (WebApplication + FAQPage + Dataset)
  const schemaOrgJSON = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://fiat-erosion-tracker.com/money-supply#webapp",
        "name": "Global Money Supply Tracker (M0, M1, M2, M3, M4)",
        "url": "https://fiat-erosion-tracker.com/money-supply",
        "description": "Interactive tracking of M0, M1, M2, M3 broad money supply aggregates, central bank balance sheets, and fiat dilution across USD, GBP, EUR, and Global markets from 1971 to 2026.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "Dataset",
        "@id": "https://fiat-erosion-tracker.com/money-supply#dataset",
        "name": "Historical Money Supply Aggregates & Central Bank Assets (1971-2026)",
        "description": "Historical time-series dataset measuring M0 base money, M1 narrow money, M2 broad money, M3 shadow broad money, and central bank assets across the Federal Reserve, Bank of England, European Central Bank, and G4 global aggregates.",
        "license": "https://creativecommons.org/licenses/by/4.0/",
        "temporalCoverage": "1971/2026"
      },
      {
        "@type": "FAQPage",
        "@id": "https://fiat-erosion-tracker.com/money-supply#faq",
        "mainEntity": MONEY_SUPPLY_FAQS.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  }), []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-[#f97316]/30 selection:text-[#f97316]">
      {/* SEO Meta Tags via React Helmet */}
      <Helmet>
        <title>Money Supply Tracker: M0, M1, M2, M3 & Central Bank Balance Sheets (1971–2026)</title>
        <meta 
          name="description" 
          content="Interactive tracking of M0, M1, M2, M3, and M4 money supply aggregates, central bank balance sheets, and fiat dilution across USD, GBP, EUR, and Global economies from 1971 to 2026." 
        />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://fiat-erosion-tracker.com/money-supply'} />
        
        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Money Supply Tracker: M0, M1, M2, M3 & Balance Sheets (1971–2026)" />
        <meta property="og:description" content="Explore exponential money printing (M0, M1, M2, M3) and the Cantillon Effect across the Federal Reserve, BoE, ECB, and global central banks." />
        <meta property="og:site_name" content="Fiat Erosion Tracker" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Money Supply Tracker: M0, M1, M2, M3 & Balance Sheets (1971–2026)" />
        <meta name="twitter:description" content="Explore historical money supply aggregates (M0, M1, M2, M3) across USD, GBP, EUR, and Global markets." />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSON)}
        </script>
      </Helmet>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 space-y-16 sm:space-y-20">
        
        {/* Top Navigation Dropdown */}
        <div className="flex justify-center">
          <HeaderNavDropdown />
        </div>

        {/* HERO SECTION */}
        <header className="relative bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-zinc-950/90 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl">
          {/* Ambient background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-orange-500/10 text-[#f97316] border border-orange-500/20 shadow-sm">
                <Landmark className="h-3.5 w-3.5" />
                <span>Central Bank Monetary Aggregates (1971–2026)</span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-zinc-800/80 hover:bg-zinc-800 hover:text-white border border-zinc-700 transition-all cursor-pointer shadow-sm"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Data</span>
              </button>
            </div>

            <div className="space-y-4 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Global Money Supply: <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
                  M0, M1, M2, M3 & Central Bank Balance Sheets
                </span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed">
                Track how much unbacked fiat currency central banks and commercial credit systems have created out of thin air since the 1971 collapse of the gold standard. Explore <strong>M0 (Base Money)</strong>, <strong>M1 (Narrow Money)</strong>, <strong>M2 (Broad Money)</strong>, <strong>M3/M4 (Broadest Liquidity)</strong>, and <strong>Central Bank Total Assets</strong> across the US Dollar, British Pound, Euro, and Global aggregates.
              </p>
            </div>

            {/* Currency & Market Selector Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-2">Select Market:</span>
              
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCurrency === 'USD'
                    ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20 border border-orange-400'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>USD (Federal Reserve)</span>
              </button>

              <button
                onClick={() => setSelectedCurrency('GBP')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCurrency === 'GBP'
                    ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20 border border-orange-400'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className="font-serif text-sm">£</span>
                <span>GBP (Bank of England)</span>
              </button>

              <button
                onClick={() => setSelectedCurrency('EUR')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCurrency === 'EUR'
                    ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20 border border-orange-400'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <span className="font-serif text-sm">€</span>
                <span>EUR (European Central Bank)</span>
              </button>

              <button
                onClick={() => setSelectedCurrency('GLOBAL')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCurrency === 'GLOBAL'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>Global Aggregate ($T)</span>
              </button>
            </div>
          </div>
        </header>

        {/* MACRO SUMMARY KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Current Broad Money (M2/M3) */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Broad Money ({currentConfig.broadMoneyLabel.split(' ')[0]})</span>
              <Coins className="h-4 w-4 text-[#f97316]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatCurrencyValue(currentPoint.m2)}
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Since 1971:</span>
              <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +{m2PctSince1971}% ({m2MultiplierSince1971}x)
              </span>
            </div>
          </div>

          {/* Card 2: Central Bank Balance Sheet */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{currentConfig.centralBankName.split('(')[0]} Assets</span>
              <Landmark className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatCurrencyValue(currentPoint.centralBankAssets)}
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Balance Sheet Expansion:</span>
              <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                +{assetsPct}% ({assetsMultiplier}x)
              </span>
            </div>
          </div>

          {/* Card 3: Post-2000 Modern Expansion */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Growth Since 2000</span>
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              +{m2PctSince2000}%
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400">2000 Baseline:</span>
              <span className="font-semibold text-zinc-300">
                {formatCurrencyValue(point2000.m2)} ({m2MultiplierSince2000}x today)
              </span>
            </div>
          </div>

          {/* Card 4: Post-2020 COVID Bazooka */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">COVID Surge Liquidity</span>
              <Flame className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
              +{(((currentPoint.m2 - chartData[6].m2) / chartData[6].m2) * 100).toFixed(0)}%
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Created 2019–2026:</span>
              <span className="font-semibold text-zinc-300">
                +{formatCurrencyValue(currentPoint.m2 - chartData[6].m2)}
              </span>
            </div>
          </div>
        </section>

        {/* MAIN INTERACTIVE MONEY SUPPLY CHART */}
        <section className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#f97316]" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {currentConfig.name} Monetary Expansion (1971–2026)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Visualizing Base Money (M0), Narrow Money (M1), Broad Money (M2), Institutional Liquidity ({currentConfig.broadMoneyLabel}), and Central Bank Total Assets in {currentConfig.scaleLabel}.
              </p>
            </div>

            {/* Chart Control Toggles */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setUseLogScale(!useLogScale)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  useLogScale
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                {useLogScale ? 'Scale: Logarithmic' : 'Scale: Linear'}
              </button>

              <button
                onClick={() => setActiveLayers(prev => ({ ...prev, btcOverlay: !prev.btcOverlay }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayers.btcOverlay
                    ? 'bg-orange-500/20 text-[#f97316] border-orange-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>Bitcoin Overlay</span>
              </button>
            </div>
          </div>

          {/* Layer Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-3 text-xs">
            <span className="text-zinc-500 font-semibold uppercase text-[10px] tracking-wider mr-1">Visible Layers:</span>
            
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, m2: !prev.m2 }))}
              className={`px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayers.m2 ? 'bg-[#f97316]/20 text-[#f97316] border-[#f97316]/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#f97316]" />
              M2 (Broad Money)
            </button>

            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, m3: !prev.m3 }))}
              className={`px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayers.m3 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {currentConfig.broadMoneyLabel}
            </button>

            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, m1: !prev.m1 }))}
              className={`px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayers.m1 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              M1 (Narrow Money)
            </button>

            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, centralBankAssets: !prev.centralBankAssets }))}
              className={`px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayers.centralBankAssets ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Central Bank Assets
            </button>

            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, m0: !prev.m0 }))}
              className={`px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeLayers.m0 ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-zinc-950 text-zinc-600 border-zinc-800'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              M0 (Base Money)
            </button>
          </div>

          {/* Chart Rendering Container */}
          <div className="h-[380px] sm:h-[460px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorM2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorM3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorM1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#71717a" 
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  tickLine={{ stroke: '#3f3f46' }}
                />
                <YAxis 
                  stroke="#71717a" 
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  tickLine={{ stroke: '#3f3f46' }}
                  scale={useLogScale ? 'log' : 'auto'}
                  domain={useLogScale ? ['auto', 'auto'] : [0, 'auto']}
                  tickFormatter={(val) => {
                    if (currentConfig.baseUnit === 'trillion') {
                      return `$${val}T`;
                    }
                    if (val >= 1000) {
                      return `${currentConfig.symbol}${(val / 1000).toFixed(0)}T`;
                    }
                    return `${currentConfig.symbol}${val}B`;
                  }}
                />
                <RechartsTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = payload[0].payload;
                      return (
                        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-2xl max-w-xs space-y-2 text-xs">
                          <div className="font-extrabold text-white border-b border-zinc-800 pb-1 flex items-center justify-between">
                            <span className="text-sm">{label} ({dataPoint.event})</span>
                          </div>
                          <div className="space-y-1 pt-1 font-mono">
                            {activeLayers.m3 && dataPoint.m3 && (
                              <div className="flex justify-between text-amber-400">
                                <span>{currentConfig.broadMoneyLabel}:</span>
                                <span className="font-bold">{formatCurrencyValue(dataPoint.m3)}</span>
                              </div>
                            )}
                            {activeLayers.m2 && (
                              <div className="flex justify-between text-[#f97316]">
                                <span>M2 (Broad Money):</span>
                                <span className="font-bold">{formatCurrencyValue(dataPoint.m2)}</span>
                              </div>
                            )}
                            {activeLayers.m1 && (
                              <div className="flex justify-between text-emerald-400">
                                <span>M1 (Narrow Money):</span>
                                <span className="font-bold">{formatCurrencyValue(dataPoint.m1)}</span>
                              </div>
                            )}
                            {activeLayers.centralBankAssets && (
                              <div className="flex justify-between text-blue-400">
                                <span>Central Bank Assets:</span>
                                <span className="font-bold">{formatCurrencyValue(dataPoint.centralBankAssets)}</span>
                              </div>
                            )}
                            {activeLayers.m0 && (
                              <div className="flex justify-between text-purple-400">
                                <span>M0 (Base Money):</span>
                                <span className="font-bold">{formatCurrencyValue(dataPoint.m0)}</span>
                              </div>
                            )}
                            {activeLayers.btcOverlay && dataPoint.btcPriceUSD > 0 && (
                              <div className="flex justify-between text-yellow-400 pt-1 border-t border-zinc-800/80">
                                <span>Bitcoin Price:</span>
                                <span className="font-bold">${dataPoint.btcPriceUSD.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-2 text-[11px] text-zinc-400 italic border-t border-zinc-800/60 leading-relaxed font-sans">
                            {dataPoint.eventDescription}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {activeLayers.m3 && (
                  <Area 
                    type="monotone" 
                    dataKey="m3" 
                    stroke="#fbbf24" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorM3)" 
                    name={currentConfig.broadMoneyLabel}
                  />
                )}

                {activeLayers.m2 && (
                  <Area 
                    type="monotone" 
                    dataKey="m2" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorM2)" 
                    name="M2 Broad Money"
                  />
                )}

                {activeLayers.m1 && (
                  <Area 
                    type="monotone" 
                    dataKey="m1" 
                    stroke="#34d399" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorM1)" 
                    name="M1 Narrow Money"
                  />
                )}

                {activeLayers.centralBankAssets && (
                  <Area 
                    type="monotone" 
                    dataKey="centralBankAssets" 
                    stroke="#60a5fa" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAssets)" 
                    name="Central Bank Assets"
                  />
                )}

                {activeLayers.m0 && (
                  <Line 
                    type="monotone" 
                    dataKey="m0" 
                    stroke="#c084fc" 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: '#c084fc' }}
                    name="M0 Base Money"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Contextual Notices under chart */}
          {(currentConfig.m3DiscontinuationNote || currentConfig.m1RevisionNote) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80">
              {currentConfig.m3DiscontinuationNote && (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>M3 Discontinuation (Shadow Banking)</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    {currentConfig.m3DiscontinuationNote}
                  </p>
                </div>
              )}

              {currentConfig.m1RevisionNote && (
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-400">
                    <Info className="h-3.5 w-3.5" />
                    <span>M1 Accounting Revision & QE Dynamics</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    {currentConfig.m1RevisionNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* INTERACTIVE M2 DILUTION & SAVINGS EROSION CALCULATOR */}
        <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-widest mb-1">
                <Calculator className="h-4 w-4" />
                <span>Interactive Money Dilution Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Your Savings vs. Central Bank M2 Dilution Calculator
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                When central banks expand the money supply, your fixed dollars, pounds, or euros represent an ever-shrinking percentage of the total economy. Enter a historic savings or salary amount to calculate how severely it has been diluted.
              </p>
            </div>
          </div>

          {/* Calculator Input Controls & Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input 1: Base Year & Amount */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Baseline Historical Year
                </label>
                <select
                  value={calcYear}
                  onChange={(e) => setCalcYear(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                >
                  {chartData.map(d => (
                    <option key={d.year} value={d.year}>
                      {d.year} — ({d.event})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Savings / Income in {calcYear}</span>
                  <span className="text-emerald-400 font-mono">
                    {currentConfig.symbol}{calcAmount.toLocaleString()}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                    {currentConfig.symbol}
                  </span>
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 px-4 py-3 pl-8 rounded-xl text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            {/* Quick Result 1: M2 Parity Today */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                M2 Money Supply Parity Today
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#f97316] my-1">
                {currentConfig.symbol}{Math.round(equivalentAmountToday).toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400">
                Supply expanded <strong className="text-amber-300">{(currentM2 / historicM2).toFixed(1)}x</strong> (from {formatCurrencyValue(historicM2)} to {formatCurrencyValue(currentM2)}).
              </div>
            </div>

            {/* Quick Result 2: Effective Dilution Loss */}
            <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Effective Dilution Loss
              </div>
              <div className="text-3xl sm:text-4xl font-black text-rose-400 my-1">
                -{dilutionLossPercentage}%
              </div>
              <div className="text-xs text-zinc-400">
                Loss of monetary claim against total circulating supply since {calcYear}.
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison: Why M2 Parity is Different from CPI Inflation */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/80">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Comparing {currentConfig.symbol}{calcAmount.toLocaleString()} ({calcYear}) Across Different Inflation Benchmarks</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* 1. M2 Money Supply Parity */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                  <span>🏛️ M2 Money Supply Parity</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                    {(currentM2 / historicM2).toFixed(1)}x
                  </span>
                </div>
                <div className="text-xl font-extrabold text-white font-mono">
                  {currentConfig.symbol}{Math.round(equivalentAmountToday).toLocaleString()}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Required capital today to hold the <strong>exact same fraction</strong> of all circulating money and bank credit in the economy.
                </p>
              </div>

              {/* 2. Official CPI Consumer Price Index */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                  <span>🛒 Official CPI Inflation</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    {selectedCurrency === 'GBP' ? '16.5x' : selectedCurrency === 'USD' ? '7.9x' : selectedCurrency === 'EUR' ? '10.5x' : '12.0x'}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-emerald-400 font-mono">
                  {currentConfig.symbol}{Math.round(calcAmount * (selectedCurrency === 'GBP' ? 16.5 : selectedCurrency === 'USD' ? 7.9 : selectedCurrency === 'EUR' ? 10.5 : 12.0) * (calcYear === 1971 ? 1 : calcYear <= 1980 ? 0.35 : calcYear <= 2000 ? 0.55 : 0.75)).toLocaleString()}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Amount needed to purchase government-defined consumer basket of goods (food staples, fuel, retail).
                </p>
              </div>

              {/* 3. Real Estate / Housing Parity */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400 flex items-center justify-between">
                  <span>🏠 Real Estate / Housing</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">
                    {selectedCurrency === 'GBP' ? '51.5x' : selectedCurrency === 'USD' ? '16.7x' : '28.0x'}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-blue-400 font-mono">
                  {currentConfig.symbol}{Math.round(calcAmount * (selectedCurrency === 'GBP' ? 51.5 : selectedCurrency === 'USD' ? 16.7 : 28.0) * (calcYear === 1971 ? 1 : calcYear <= 1980 ? 0.38 : calcYear <= 2000 ? 0.6 : 0.8)).toLocaleString()}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Amount needed to purchase the same physical square footage of average residential real estate.
                </p>
              </div>

              {/* 4. Physical Gold Benchmark */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-400 flex items-center justify-between">
                  <span>🪙 Physical Gold Parity</span>
                  <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-mono text-[10px]">
                    {selectedCurrency === 'GBP' ? '155x' : '82.6x'}
                  </span>
                </div>
                <div className="text-xl font-extrabold text-yellow-400 font-mono">
                  {currentConfig.symbol}{Math.round(calcAmount * (selectedCurrency === 'GBP' ? 155 : 82.6) * (calcYear === 1971 ? 1 : calcYear <= 1980 ? 0.28 : calcYear <= 2000 ? 0.45 : 0.65)).toLocaleString()}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Amount needed to buy the exact same weight in troy ounces of physical gold as in {calcYear}.
                </p>
              </div>
            </div>

            {/* In-depth educational note on why M2 Parity is so high */}
            <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                <Info className="h-4 w-4" />
                <span>Why does £10 in 1971 equal £2,102 in M2 Parity vs. only £165 in CPI?</span>
              </div>
              <div className="text-zinc-300 space-y-2 leading-relaxed">
                <p>
                  <strong>1. The Distinction between CPI and Money Supply:</strong> The official Consumer Price Index (CPI) only tracks a selective basket of everyday consumer goods (bread, milk, televisions, cheap imported electronics). Because technological productivity and globalization (cheap manufacturing in Asia) made consumer items much cheaper to produce, official CPI only rose by <strong>~16.5x</strong> since 1971.
                </p>
                <p>
                  <strong>2. Where the 210x Expansion Went (Asset Inflation):</strong> In 1971, total UK M2 broad money was just <strong>£12.8 Billion</strong>. Today, commercial banks and the Bank of England have expanded total broad money to <strong>£2,690 Billion (£2.69 Trillion)</strong>—a staggering <strong>210.2x expansion</strong>. That extra freshly created currency did not sit in milk prices; it flooded directly into scarce financial assets and land:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-zinc-400">
                  <li>Average UK House: rose from <strong>£5,632</strong> (1971) to <strong>£290,000</strong> (2026) — an increase of <strong>51.5x</strong> (and over 80x in London).</li>
                  <li>1 Ounce of Gold: rose from <strong>£14.50</strong> (1971) to <strong>~£2,250</strong> (2026) — an increase of <strong>155x</strong>.</li>
                  <li>UK Equity Indices & Prime Land: expanded by over <strong>120x–200x</strong>.</li>
                </ul>
                <p className="text-amber-300 font-medium">
                  💡 <strong>Key Takeaway:</strong> £165 today buys the same basic grocery cart as £10 in 1971. But to retain your proportional claim on the nation's total wealth, capital assets, and credit pool, you need <strong>£2,102</strong> today. That gap is the invisible wealth tax of fiat debasement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HISTORICAL TIMELINE TABLE */}
        <section className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-400" />
                <span>Historical Money Supply Breakdown Table (1971–2026)</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Decade-by-decade breakdown of monetary aggregates across major crises and policy interventions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[11px] bg-zinc-950/60">
                  <th className="py-4 px-4">Year & Landmark Event</th>
                  <th className="py-4 px-4 text-right">M0 Base Money</th>
                  <th className="py-4 px-4 text-right">M1 Narrow Money</th>
                  <th className="py-4 px-4 text-right text-[#f97316]">M2 Broad Money</th>
                  <th className="py-4 px-4 text-right text-amber-400">{currentConfig.broadMoneyLabel}</th>
                  <th className="py-4 px-4 text-right text-blue-400">CB Assets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {chartData.map((row) => (
                  <tr key={row.year} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-xs">
                          {row.year}
                        </span>
                        <span>{row.event}</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 max-w-md line-clamp-1">
                        {row.eventDescription}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-zinc-300">
                      {formatCurrencyValue(row.m0)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-emerald-400">
                      {formatCurrencyValue(row.m1)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-[#f97316]">
                      {formatCurrencyValue(row.m2)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-amber-400">
                      {row.m3 ? formatCurrencyValue(row.m3) : '—'}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-blue-400">
                      {formatCurrencyValue(row.centralBankAssets)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* IN-DEPTH EDUCATIONAL MODULE: CANTILLON EFFECT & MONETARY ARCHITECTURE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: The Cantillon Effect */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="h-3.5 w-3.5" />
              <span>Economic Mechanism</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              The Cantillon Effect: Who Gets the New Money First?
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              When central banks execute Quantitative Easing or governments issue deficit treasuries, the newly minted money does not disperse equally:
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <span className="font-bold text-white">Primary Dealers & Mega Corporations:</span>
                  <p className="text-zinc-400 mt-0.5">Receive multi-billion dollar liquidity injections at near-0% interest rates before prices rise, buying real estate, private equity, and hard assets.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <span className="font-bold text-white">Asset Inflation:</span>
                  <p className="text-zinc-400 mt-0.5">Equities, luxury housing, farmland, and gold explode upward in price as institutional capital front-runs monetary debasement.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3">
                <span className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                <div>
                  <span className="font-bold text-white">Wage Earners & Retirees:</span>
                  <p className="text-zinc-400 mt-0.5">Receive new money last via lagging wage renegotiations, only after rent, groceries, healthcare, and education have doubled in price.</p>
                </div>
              </div>
            </div>
            <div className="pt-2 text-xs text-zinc-400 italic bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/60">
              "{currentConfig.cantillonInsight}"
            </div>
          </div>

          {/* Card 2: Commercial Bank Fractional Reserve Credit Creation */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Scale className="h-3.5 w-3.5" />
              <span>Banking Mechanics</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Fractional Reserve & Commercial Debt Creation
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Contrary to popular belief, over 90% of circulating broad money (M2/M3) is not printed on physical government printing presses—it is typed into computer screens by commercial banks via debt:
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="font-bold text-white mb-1">Loans Create Deposits (Not Vice Versa)</div>
                <p className="text-zinc-400">When a customer takes out a $500,000 mortgage, the bank does not lend someone else’s physical cash. The bank creates a new asset (the loan) and a new liability (the deposit) simultaneously out of thin air.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="font-bold text-white mb-1">The Debt Extinguishment Paradox</div>
                <p className="text-zinc-400">When loans are repaid, that money disappears from existence. Because interest must be paid on top of principal, the system requires endless compounding debt expansion to prevent catastrophic deflationary collapse.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="font-bold text-white mb-1">Why Bitcoin Breaks the Multiplier Loop</div>
                <p className="text-zinc-400">Bitcoin has no counterparty risk, cannot be fractionalized at the base settlement layer, and its 21,000,000 hard supply cap cannot be altered by central bank decrees or commercial bank credit expansion.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (SEO FAQ ACCORDION) */}
        <section className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-[#f97316] border border-orange-500/20">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Money Supply, Central Banks & Inflation FAQ
            </h2>
            <p className="text-sm text-zinc-400">
              Comprehensive economic explanations of monetary aggregates, shadow banking, and central bank balance sheets.
            </p>
          </div>

          <div className="space-y-4">
            {MONEY_SUPPLY_FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  className="border border-zinc-800/90 rounded-2xl bg-zinc-950/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-zinc-100 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-[#f97316] shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-zinc-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-4 whitespace-pre-line font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default MoneySupplyPage;
