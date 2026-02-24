import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Legend, ReferenceLine 
} from 'recharts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Line as ChartLine } from 'react-chartjs-2';

import { 
  Currency 
} from './types';
import { 
  CURRENCY_CONFIGS, INITIAL_SAVINGS_DEFAULT, 
  INITIAL_ASSET_VALUE_DEFAULT 
} from './constants';
import TickerBox from './components/TickerBox';
import Tooltip from './components/Tooltip';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const verticalLinePlugin = {
  id: 'verticalLine',
  afterDraw: (chart: any) => {
    if (chart.tooltip?._active?.length) {
      const activePoint = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#52525b';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.restore();
    }
  }
};

const App: React.FC = () => {
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [savings, setSavings] = useState<number | string>(INITIAL_SAVINGS_DEFAULT);
  const [assetValue, setAssetValue] = useState<number | string>(INITIAL_ASSET_VALUE_DEFAULT);
  
  // RESTRUCTURED: Three inputs for the performance chart
  const [accumInitialSavings, setAccumInitialSavings] = useState<number | string>(100000);
  const [monthlyAddition, setMonthlyAddition] = useState<number | string>(500);
  const [accumInitialAsset, setAccumInitialAsset] = useState<number | string>(1000000);
  
  // NEW: Toggle between Indexed and Absolute views
  const [chartViewMode, setChartViewMode] = useState<'indexed' | 'absolute'>('indexed');
  
  // NEW: Collapsible state for About/Disclaimer
  const [showAbout, setShowAbout] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const handleSync = async () => {
    setSyncStatus('loading');
    try {
      const response = await fetch('/api/github-sync', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setSyncStatus('success');
        setSyncMessage(data.message);
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
        setSyncMessage(data.error || 'Sync failed');
      }
    } catch (err) {
      setSyncStatus('error');
      setSyncMessage('Network error');
    }
  };

  // Shared time window state
  const [lookbackYears, setLookbackYears] = useState(10);
  const [projectionYears, setProjectionYears] = useState(10);
  const [isMounted, setIsMounted] = useState(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const config = CURRENCY_CONFIGS[currency];

  // FIXED: Improved parsing handlers to prevent values getting "stuck"
  const handleNumericInput = (setter: React.Dispatch<React.SetStateAction<number | string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (rawValue === '') {
      setter('');
      return;
    }
    setter(rawValue);
  };

  const handleGlobalSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (rawValue === '') {
      setSavings('');
      return;
    }
    setSavings(rawValue);
  };

  const handleGlobalAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (rawValue === '') {
      setAssetValue('');
      return;
    }
    setAssetValue(rawValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Chart 1: Recharts - Purchasing Power Analysis
  const erosionData = useMemo(() => Array.from({ length: lookbackYears + projectionYears + 1 }, (_, i) => {
    const yearOffset = i - lookbackYears;
    const year = new Date().getFullYear() + yearOffset;
    const parsedSavings = typeof savings === 'string' ? parseFloat(savings) || 0 : savings;
    const officialDecay = parsedSavings * Math.pow(1 - config.officialRate, yearOffset);
    const altDecay = parsedSavings * Math.pow(1 - config.altRate, yearOffset);

    return {
      year,
      nominal: parsedSavings,
      official: Math.round(officialDecay),
      alternative: Math.round(altDecay),
      isCurrent: yearOffset === 0
    };
  }), [lookbackYears, projectionYears, savings, config]);

  // Chart 2: Recharts - Asset Gap
  const assetGapData = useMemo(() => Array.from({ length: lookbackYears + projectionYears + 1 }, (_, i) => {
    const yearOffset = i - lookbackYears;
    const year = new Date().getFullYear() + yearOffset;
    const parsedSavings = typeof savings === 'string' ? parseFloat(savings) || 0 : savings;
    const parsedAssetValue = typeof assetValue === 'string' ? parseFloat(assetValue) || 0 : assetValue;
    const stagnantCash = parsedSavings;
    const officialAsset = parsedAssetValue * Math.pow(1 + config.officialRate, yearOffset);
    const shadowAsset = parsedAssetValue * Math.pow(1 + config.altRate, yearOffset);

    return {
      year, 
      stagnantCash: Math.round(stagnantCash), 
      officialAsset: Math.round(officialAsset),
      shadowAsset: Math.round(shadowAsset)
    };
  }), [lookbackYears, projectionYears, savings, assetValue, config]);

  // UPDATED: Toggle between Indexed and Absolute data prep
  const accumulatedChartData = useMemo(() => {
    const years = Array.from({ length: projectionYears + 1 }, (_, i) => new Date().getFullYear() + i);
    
    // Dataset arrays
    const dsNominal = [];
    const dsWithAdditions = [];
    const dsAssetOfficial = [];
    const dsAssetShadow = [];

    // Helper for tooltips (absolute and percentage)
    const metadata: any = { 
      nominal: { abs: [], pct: [] }, 
      additions: { abs: [], pct: [] }, 
      official: { abs: [], pct: [] }, 
      shadow: { abs: [], pct: [] } 
    };
    
    const parsedAccumInitialSavings = typeof accumInitialSavings === 'string' ? parseFloat(accumInitialSavings) || 0 : accumInitialSavings;
    const parsedMonthlyAddition = typeof monthlyAddition === 'string' ? parseFloat(monthlyAddition) || 0 : monthlyAddition;
    const parsedAccumInitialAsset = typeof accumInitialAsset === 'string' ? parseFloat(accumInitialAsset) || 0 : accumInitialAsset;
    
    const baseSavings = parsedAccumInitialSavings || 1;
    const baseAsset = parsedAccumInitialAsset || 1;

    for (let yearIdx = 0; yearIdx <= projectionYears; yearIdx++) {
      const totalMonths = yearIdx * 12;
      
      // Absolute Calculations
      const absNominal = parsedAccumInitialSavings;
      const absAdditions = parsedAccumInitialSavings + (parsedMonthlyAddition * totalMonths);
      const absOfficial = parsedAccumInitialAsset * Math.pow(1 + config.officialRate, yearIdx);
      const absShadow = parsedAccumInitialAsset * Math.pow(1 + config.altRate, yearIdx);

      // Percentage Calculations (Relative to Start)
      const pctNominal = 100;
      const pctAdditions = (absAdditions / baseSavings) * 100;
      const pctOfficial = (absOfficial / baseAsset) * 100;
      const pctShadow = (absShadow / baseAsset) * 100;

      // Fill metadata
      metadata.nominal.abs.push(absNominal); metadata.nominal.pct.push(pctNominal);
      metadata.additions.abs.push(absAdditions); metadata.additions.pct.push(pctAdditions);
      metadata.official.abs.push(absOfficial); metadata.official.pct.push(pctOfficial);
      metadata.shadow.abs.push(absShadow); metadata.shadow.pct.push(pctShadow);

      // Determine plotted value based on view mode
      if (chartViewMode === 'indexed') {
        dsNominal.push(pctNominal);
        dsWithAdditions.push(pctAdditions);
        dsAssetOfficial.push(pctOfficial);
        dsAssetShadow.push(pctShadow);
      } else {
        dsNominal.push(absNominal);
        dsWithAdditions.push(absAdditions);
        dsAssetOfficial.push(absOfficial);
        dsAssetShadow.push(absShadow);
      }
    }

    return {
      labels: years,
      datasets: [
        {
          label: 'Nominal Savings',
          data: dsNominal,
          metadata: metadata.nominal,
          borderColor: '#71717a',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Savings + Monthly Additions',
          data: dsWithAdditions,
          metadata: metadata.additions,
          borderColor: '#f97316',
          backgroundColor: '#f9731633',
          borderWidth: 3,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Asset Official (CPI Floor)',
          data: dsAssetOfficial,
          metadata: metadata.official,
          borderColor: '#ef4444',
          backgroundColor: '#ef444433',
          borderWidth: 3,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
        {
          label: 'Asset Shadow/Alternative',
          data: dsAssetShadow,
          metadata: metadata.shadow,
          borderColor: '#a855f7',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [2, 2],
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [projectionYears, accumInitialSavings, monthlyAddition, accumInitialAsset, config, chartViewMode]);

  // FIXED: Enhanced hover tooltips and interaction mode for third chart
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false, // Allows tooltip to appear anywhere on the vertical axis
    },
    onHover: (event: any, chartElement: any) => {
      const target = event.native ? event.native.target : event.target;
      if (target) {
        target.style.cursor = chartElement[0] ? 'pointer' : 'default';
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#71717a', font: { size: 11, weight: 'bold' as any }, padding: 15 },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#18181b',
        titleColor: '#a1a1aa',
        bodyColor: '#f4f4f5',
        borderColor: '#3f3f46',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            const m = context.dataset.metadata;
            if (!m) return context.dataset.label;
            const abs = m.abs[context.dataIndex];
            const pct = m.pct[context.dataIndex];
            return `${context.dataset.label}: ${pct.toFixed(1)}% → ${config.symbol}${Math.round(abs).toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 11 } } },
      y: {
        type: 'linear' as const,
        title: { 
          display: true, 
          text: chartViewMode === 'indexed' ? 'Indexed Value (%)' : `Absolute Value (${config.symbol})`, 
          color: '#71717a', 
          font: { size: 10, weight: 'bold' } 
        },
        grid: { color: '#27272a' },
        ticks: { 
          color: '#71717a', 
          font: { size: 10 }, 
          callback: (val: any) => chartViewMode === 'indexed' ? `${val}%` : `${config.symbol}${val.toLocaleString()}` 
        },
      }
    }
  }), [config, chartViewMode]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col">
      <header className="max-w-7xl mx-auto w-full px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-balance text-white">
          Watch your purchasing power <span className="text-[#f97316]">melt away.</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light mb-6">
          Fiat currency is designed to lose value. Visualize the silent decay of your savings in real time.
        </p>

        {/* Collapsible About & Disclaimer */}
        <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button 
            onClick={() => setShowAbout(!showAbout)}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-[#f97316] transition-colors group"
          >
            <span>About this tool & Disclaimer</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" height="16" 
              viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-300 ${showAbout ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          <button
            onClick={handleSync}
            disabled={syncStatus === 'loading'}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md border transition-all ${
              syncStatus === 'loading' ? 'border-zinc-700 text-zinc-700 cursor-not-allowed' :
              syncStatus === 'success' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' :
              syncStatus === 'error' ? 'border-red-500/50 text-red-500 bg-red-500/10' :
              'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
            }`}
            title={syncMessage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
            <span>{syncStatus === 'loading' ? 'Syncing...' : syncStatus === 'success' ? 'Synced' : syncStatus === 'error' ? 'Failed' : 'Sync to GitHub'}</span>
          </button>
        </div>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAbout ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-zinc-300 text-sm leading-relaxed flex flex-col gap-4">
              <p>
                The purpose of this site is to illustrate the erosion of fiat currency purchasing power over time, using both official government-reported inflation rates (CPI/HICP from ONS for UK, BLS for US, Eurostat for EUR) and a higher alternative "shadow" estimate as a reference point.
              </p>
              <p className="font-bold text-zinc-100">
                This is a personal/educational demonstration tool only — it is NOT financial advice, NOT investment guidance, and NOT a forecast or prediction of future asset prices.
              </p>
              <p>
                No direct ShadowStats-style data is publicly available for the UK or Eurozone, so the higher "shadow" rate shown is a rough proxy (official rate + ~5.5%) based on US critiques, historical patterns, and asset-price trends. Many observers argue that official CPI/HICP figures systematically understate the true rise in the cost of living — this tool allows you to visualise both perspectives side-by-side for discussion and awareness.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col gap-12 pb-24">
        
        {/* Main Controls */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800/50">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-zinc-500">Currency</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
            >
              <option value="GBP">UK (GBP) - Default</option>
              <option value="USD">US (USD)</option>
              <option value="EUR">EU (EUR)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-semibold text-zinc-500">Global Savings Input</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-500 font-medium">{config.symbol}</span>
              <input 
                type="text" 
                value={savings === '' ? '' : Number(savings).toLocaleString()} 
                onChange={handleGlobalSavingsChange}
                className="bg-zinc-950 border border-zinc-800 pl-8 pr-4 py-3 rounded-lg text-white w-full focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all font-semibold"
              />
            </div>
          </div>
        </section>

        {/* Live Depreciation Monitor */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TickerBox 
            label="Official CPI Purchasing Power" 
            tooltipText={config.officialSource}
            initialValue={typeof savings === 'string' ? parseFloat(savings) || 0 : savings}
            annualRate={config.officialRate}
            config={config}
          />
          <TickerBox 
            label="Alternative Estimate Power" 
            tooltipText={config.altDescription}
            initialValue={typeof savings === 'string' ? parseFloat(savings) || 0 : savings}
            annualRate={config.altRate}
            config={config}
          />
        </section>

        {/* Global Slider */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center">
           <div className="flex justify-between w-full md:w-96 text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">
             <span>Time Window</span>
             <span>{lookbackYears}y Lookback / {projectionYears}y Project</span>
           </div>
           <input 
            type="range" min="1" max="20" step="1"
            value={projectionYears}
            onChange={(e) => {
              setProjectionYears(parseInt(e.target.value));
              setLookbackYears(parseInt(e.target.value));
            }}
            className="w-full md:w-96 accent-[#f97316] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
           />
        </div>

        {/* Charts Grid */}
        <div className="flex flex-col gap-12">
          {/* Chart 1: Recharts - Purchasing Power Analysis */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Purchasing Power Analysis</h3>
                <Tooltip text="Shows how inflation erodes the real value of your nominal savings over time.">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 hover:text-zinc-300 transition-colors"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </Tooltip>
              </div>
              <p className="text-zinc-500 text-sm mt-1">Nominal capital vs real-world value over time</p>
            </div>
            
            <div className="h-[400px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={erosionData} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="year" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} 
                    tickFormatter={(val) => `${config.symbol}${val.toLocaleString()}`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '30px' }} />
                  <ReferenceLine x={new Date().getFullYear()} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'TODAY', position: 'top', fill: '#f97316', fontSize: 10, fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="nominal" name="Nominal Value" stroke="#71717a" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="official" name="Official Power" stroke="#3b82f6" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="alternative" name="Alternative Power" stroke="#f97316" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Asset Gap Over Time */}
          <div className="my-8 md:my-12 lg:my-16 flex justify-center">
            {/* AdSense Placeholder - Responsive Horizontal Banner */}
            <div className="w-full max-w-[728px] h-[90px] md:h-[250px] bg-zinc-800/50 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">
              AdSense Placeholder: Insert responsive ad unit here (e.g., 300x250 or 728x90)
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Asset Gap Over Time</h3>
                  <Tooltip text="Illustrates the widening gap between holding cash and holding assets that appreciate with inflation.">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 hover:text-zinc-300 transition-colors"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </Tooltip>
                </div>
                <p className="text-zinc-500 text-sm mt-1">Stagnant cash vs Official & Shadow asset growth floor</p>
              </div>
              <div className="flex flex-col gap-1 w-full md:w-48">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Initial Asset Value</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-zinc-500 font-medium">{config.symbol}</span>
                  <input 
                    type="text" 
                    value={assetValue === '' ? '' : Number(assetValue).toLocaleString()} 
                    onChange={handleGlobalAssetChange}
                    className="bg-zinc-950 border border-zinc-800 pl-7 pr-3 py-2 rounded text-sm text-white focus:ring-1 focus:ring-[#f97316] w-full"
                  />
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assetGapData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="year" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} 
                    tickFormatter={(val) => `${config.symbol}${val.toLocaleString()}`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    formatter={(val) => [`${config.symbol}${val.toLocaleString()}`]}
                  />
                  <Legend verticalAlign="bottom" height={60} wrapperStyle={{ paddingTop: '20px' }} />
                  <ReferenceLine x={new Date().getFullYear()} stroke="#f97316" strokeDasharray="3 3" label={{ value: 'TODAY', position: 'top', fill: '#f97316', fontSize: 10, fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="stagnantCash" name="Stagnant Cash" stroke="#71717a" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="officialAsset" name="Official Asset Increase" stroke="#ef4444" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="shadowAsset" name="Shadow Asset Increase" stroke="#a855f7" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-12 text-xs text-zinc-600 text-center italic">
              Asset lines grow nominally at official CPI ({ (config.officialRate * 100).toFixed(1) }%) and shadow ({ (config.altRate * 100).toFixed(1) }%) inflation rates.
            </div>
          </div>

          {/* Third Chart: Growth & Erosion Comparison (View Toggle) */}
          <div className="my-8 md:my-12 lg:my-16 flex justify-center">
            {/* AdSense Placeholder - Responsive Horizontal Banner */}
            <div className="w-full max-w-[728px] h-[90px] md:h-[250px] bg-zinc-800/50 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">
              AdSense Placeholder: Insert responsive ad unit here (e.g., 300x250 or 728x90)
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
            <div className="flex flex-col mb-8 gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">Disparity Breakdown: Savings vs Assets</h3>
                    <Tooltip text="Illustrates that even with additional savings, the asset is still appreciating quicker (potentially).">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 hover:text-zinc-300 transition-colors"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    </Tooltip>
                  </div>
                  <p className="text-zinc-500 text-sm mt-1">Performance comparison with dynamic view modes</p>
                </div>
                {/* NEW: View Mode Toggle */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setChartViewMode('indexed')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${chartViewMode === 'indexed' ? 'bg-[#f97316] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Indexed (%)
                  </button>
                  <button 
                    onClick={() => setChartViewMode('absolute')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${chartViewMode === 'absolute' ? 'bg-[#f97316] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    Absolute ({config.symbol})
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Initial Savings</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-zinc-500 text-xs font-bold">{config.symbol}</span>
                      <input 
                        type="text" 
                        value={accumInitialSavings === '' ? '' : Number(accumInitialSavings).toLocaleString()} 
                        onChange={handleNumericInput(setAccumInitialSavings)}
                        className="bg-zinc-950 border border-zinc-800 pl-7 pr-3 py-2 rounded text-sm text-white focus:ring-1 focus:ring-[#f97316] w-full font-semibold"
                      />
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Monthly Addition</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-zinc-500 text-xs font-bold">{config.symbol}</span>
                      <input 
                        type="text" 
                        value={monthlyAddition === '' ? '' : Number(monthlyAddition).toLocaleString()} 
                        onChange={handleNumericInput(setMonthlyAddition)}
                        className="bg-zinc-950 border border-zinc-800 pl-7 pr-3 py-2 rounded text-sm text-white focus:ring-1 focus:ring-[#f97316] w-full font-semibold"
                      />
                    </div>
                 </div>
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Initial Asset Value</label>
                      <Tooltip text="Starting value for both asset lines. Used to demonstrate scale differences in absolute view.">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      </Tooltip>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-zinc-500 text-xs font-bold">{config.symbol}</span>
                      <input 
                        type="text" 
                        value={accumInitialAsset === '' ? '' : Number(accumInitialAsset).toLocaleString()} 
                        onChange={handleNumericInput(setAccumInitialAsset)}
                        className="bg-zinc-950 border border-zinc-800 pl-7 pr-3 py-2 rounded text-sm text-white focus:ring-1 focus:ring-[#f97316] w-full font-semibold"
                      />
                    </div>
                 </div>
              </div>
            </div>

            <div 
              ref={chartContainerRef} 
              className="w-full h-[400px] min-h-[300px] relative overflow-hidden"
            >
              {isMounted && (
                <div key={`disparity-chart-wrapper-${currency}-${chartViewMode}`} className="h-full w-full">
                  <ChartLine 
                    data={accumulatedChartData} 
                    options={chartOptions} 
                    plugins={[verticalLinePlugin]}
                  />
                </div>
              )}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-xs text-zinc-500 italic text-center max-w-3xl leading-relaxed">
                All lines {chartViewMode === 'indexed' ? 'indexed to 100' : 'plotted in absolute terms'} for {chartViewMode === 'indexed' ? 'fair comparison of % performance' : 'clear absolute disparity'}. 
                <span className="block mt-2">
                  <strong>Note:</strong> High monthly additions relative to low initial savings create strong early % growth in the orange line (visible in Indexed view) — but in absolute {config.symbol} terms, assets on larger bases generate far greater wealth over time due to the relentless power of compounding.
                </span>
              </p>
            </div>
          </div>
          
          {/* NEW: Informational Page Links */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <Link 
              to="/history" 
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-bold tracking-wide transition-all text-center shadow-sm hover:shadow-md"
            >
              History of Money
            </Link>
            <Link 
              to="/cbdc" 
              className="w-full sm:w-auto px-6 py-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white font-bold tracking-wide transition-all text-center shadow-sm hover:shadow-md"
            >
              CBDCs and Control Risks
            </Link>
          </div>

          <div className="my-8 md:my-12 flex justify-center">
            {/* Bottom AdSense Placeholder - Responsive Banner */}
            <div className="w-full max-w-[728px] h-[90px] md:h-[250px] bg-zinc-800/50 border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400">
              AdSense Placeholder: Bottom responsive ad (full-width on mobile)
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-zinc-500 w-full text-center">
            <a href="https://www.ons.gov.uk/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ONS (UK)</a>
            <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">BLS (US)</a>
            <a href="https://ec.europa.eu/eurostat" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Eurostat (EU)</a>
            <a href="http://www.shadowstats.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ShadowStats</a>
          </div>
          
          <div className="text-center flex flex-col gap-4">
            <p className="text-zinc-600 text-xs max-w-xl text-balance">
              This is an educational tool illustrating inflation erosion — not financial advice or a prediction tool. Use at your own risk.
            </p>
            <p className="text-zinc-400 font-medium">© 2026 Peter Adam J (@Peteradamj)</p>
            <p className="text-zinc-600 text-xs max-w-xl text-balance">
              Personal/educational tool • Not financial advice • <a href="https://x.com/Peteradamj" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline">Follow on X</a> • <Link to="/privacy" className="text-[#f97316] hover:underline">Privacy Policy</Link> • All rights reserved. 
              No commercial reproduction without permission.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
