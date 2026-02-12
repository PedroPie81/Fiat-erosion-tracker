
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Region, InflationData, HistoricalPoint, ProjectionBasis, BtcPoint } from './types';
import { fetchInflationData, generateFullSeries, getProjectedRates } from './services/inflationService';
import { Ticker } from './components/Ticker';
import { StatCard } from './components/StatCard';
import { HistoricalChart } from './components/HistoricalChart';
import { Analytics } from '@vercel/analytics/react';

/**
 * Hey copycat — if you're reading this, consider crediting @Peteradamj instead of forking.
 * Thanks! Built with ❤️ by Peter Adam J in 2026.
 */

const App: React.FC = () => {
  const [region, setRegion] = useState<Region>(Region.UK);
  const [savings, setSavings] = useState<number>(100000);
  const [pastYears, setPastYears] = useState<number>(10);
  const [futureYears, setFutureYears] = useState<number>(15);
  const [projectionBasis, setProjectionBasis] = useState<ProjectionBasis>(ProjectionBasis.CONSTANT);
  const [altMultiplier] = useState<number>(2.8);
  
  const [inflationData, setInflationData] = useState<InflationData | null>(null);
  const [seriesPoints, setSeriesPoints] = useState<HistoricalPoint[]>([]);
  const [btcPoints, setBtcPoints] = useState<BtcPoint[]>([]);
  const [btcLiveMeta, setBtcLiveMeta] = useState<{ currentPrice: number; startPrice: number; lastUpdated: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [btcLoading, setBtcLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isBitcoinMode, setIsBitcoinMode] = useState<boolean>(false);
  const [isLogScale, setIsLogScale] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadData = useCallback(async (manual: boolean = false) => {
    if (manual) setIsRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await fetchInflationData(region, altMultiplier);
      setInflationData(data);
      if (manual) {
        if (data.isFallback && region === Region.UK) {
          showToast("ONS API Retired Nov 2024. Using latest rates.");
        } else {
          showToast("Rates refreshed successfully");
        }
        if (isBitcoinMode) await fetchBtcData();
      }
    } catch (error) {
      console.error("Failed to load data", error);
      showToast("Error fetching live rates. Using fallback.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [region, altMultiplier, isBitcoinMode]);

  const fetchBtcData = useCallback(async () => {
    if (!isBitcoinMode || !inflationData) return;
    setBtcLoading(true);
    const currency = inflationData.currency.toLowerCase();
    
    const lookbackDate = new Date();
    lookbackDate.setFullYear(lookbackDate.getFullYear() - pastYears);
    const day = String(lookbackDate.getDate()).padStart(2, '0');
    const month = String(lookbackDate.getMonth() + 1).padStart(2, '0');
    const year = lookbackDate.getFullYear();
    const dateParam = `${day}-${month}-${year}`;

    try {
      const currentRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}&include_last_updated_at=true`);
      if (!currentRes.ok) throw new Error('Current price fetch failed');
      const currentData = await currentRes.json();
      const currentPrice = currentData.bitcoin[currency];
      const updatedAt = new Date(currentData.bitcoin.last_updated_at * 1000).toLocaleTimeString();

      const historyRes = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${dateParam}&localization=false`);
      if (!historyRes.ok) throw new Error('Historical price fetch failed');
      const historyData = await historyRes.json();
      const startPrice = historyData.market_data.current_price[currency];

      const days = pastYears * 365;
      const chartRes = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency}&days=${days}&interval=daily`);
      const chartData = await chartRes.json();
      
      if (chartData.prices && chartData.prices.length > 0) {
        const processed: BtcPoint[] = chartData.prices.map(([ts, price]: [number, number]) => ({
          timestamp: ts,
          dateLabel: new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }),
          price: price,
          value: (savings / startPrice) * price
        }));
        setBtcPoints(processed);
      }

      setBtcLiveMeta({ currentPrice, startPrice, lastUpdated: updatedAt });
    } catch (error) {
      console.error("BTC fetch error:", error);
      showToast("Market data fallback active.");
      const fallbackPrices = { gbp: 52000, usd: 68000, eur: 62000 };
      const fallbackCurrent = (fallbackPrices as any)[currency] || 68000;
      const fallbackStart = pastYears === 1 ? (region === Region.UK ? 75000 : 98000) : fallbackCurrent / Math.pow(1.5, pastYears);

      setBtcLiveMeta({ currentPrice: fallbackCurrent, startPrice: fallbackStart, lastUpdated: "Estimate" });

      const days = pastYears * 365;
      const fallbackPoints: BtcPoint[] = [];
      for (let i = days; i >= 0; i -= 30) {
        const ts = Date.now() - (i * 86400000);
        const p = fallbackStart + (fallbackCurrent - fallbackStart) * (1 - (i / days));
        fallbackPoints.push({
          timestamp: ts,
          dateLabel: new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }),
          price: p,
          value: (savings / fallbackStart) * p
        });
      }
      setBtcPoints(fallbackPoints);
    } finally {
      setBtcLoading(false);
    }
  }, [isBitcoinMode, pastYears, inflationData, savings, region]);

  useEffect(() => {
    if (isBitcoinMode) setIsLogScale(pastYears > 1);
  }, [isBitcoinMode, pastYears]);

  useEffect(() => {
    loadData();
  }, [region, loadData]);

  useEffect(() => {
    if (isBitcoinMode) fetchBtcData();
  }, [isBitcoinMode, fetchBtcData]);

  useEffect(() => {
    if (inflationData) {
      const points = generateFullSeries(savings, pastYears, futureYears, inflationData, projectionBasis);
      setSeriesPoints(points);
    }
  }, [savings, pastYears, futureYears, projectionBasis, inflationData]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const btcSummary = useMemo(() => {
    if (!isBitcoinMode || !btcLiveMeta) return null;
    const { currentPrice, startPrice } = btcLiveMeta;
    const multiplier = currentPrice / startPrice; 
    const currentValue = savings * multiplier;
    const percent = (multiplier - 1) * 100;
    
    return {
      currentValue,
      multiplier: multiplier.toFixed(2),
      percent: percent.toLocaleString(undefined, { maximumFractionDigits: 1 }),
      isLoss: percent < 0,
      startPrice,
      endPrice: currentPrice,
      lastUpdated: btcLiveMeta.lastUpdated
    };
  }, [isBitcoinMode, btcLiveMeta, savings]);

  const projectedEndValues = useMemo(() => {
    if (seriesPoints.length === 0) return null;
    return seriesPoints[seriesPoints.length - 1];
  }, [seriesPoints]);

  const currentProjectedRates = useMemo(() => {
    if (!inflationData) return null;
    return getProjectedRates(inflationData, projectionBasis);
  }, [inflationData, projectionBasis]);

  const handleShare = () => {
    if (!seriesPoints.length || !inflationData) return;
    const lastPoint = seriesPoints[seriesPoints.length - 1];
    let text = "";
    
    if (isBitcoinMode && btcSummary) {
      text = `Bitcoin Report: My ${inflationData.symbol}${savings.toLocaleString()} invested in BTC ${pastYears} years ago is now worth ${inflationData.symbol}${btcSummary.currentValue.toLocaleString(undefined, {maximumFractionDigits: 0})} (${btcSummary.isLoss ? '' : '+'}${btcSummary.percent}%). 🚀`;
    } else {
      text = `Inflation Report: In ${futureYears} years, my ${inflationData.symbol}${savings.toLocaleString()} will only buy ${inflationData.symbol}${lastPoint.realOfficialProjected?.toLocaleString(undefined, { maximumFractionDigits: 0 })} worth of goods. 💸`;
    }

    // Protective Branding Watermark for Text Sharing
    text += `\n\nAnalyzed with Fiat Erosion Tracker by @Peteradamj 💎`;
    
    navigator.clipboard.writeText(text);
    showToast("Summary with branding copied!");
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isBitcoinMode ? 'bg-[#050505] selection:bg-orange-500/30' : 'bg-[#09090b] selection:bg-blue-500/30'}`}>
      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] glass px-6 py-3 rounded-2xl border border-white/10 shadow-2xl animate-bounce text-sm font-medium text-white">
          {toast}
        </div>
      )}

      {/* Refined Fixed Branding Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-zinc-500 text-[10px] py-2 px-4 text-center z-50 border-t border-zinc-800 flex flex-wrap justify-center items-center gap-x-2">
        <span>© 2026 Peter Adam J (@Peteradamj) • Personal/educational tool • Not financial advice • </span>
        <a href="https://x.com/Peteradamj" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline transition-colors">
          Follow on X
        </a>
        <span className="hidden sm:inline opacity-30 ml-2">| All rights reserved. No commercial reproduction without permission.</span>
      </footer>

      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 ${isBitcoinMode ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-zinc-100 text-black'}`}>
              {isBitcoinMode ? '₿' : 'F'}
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              {isBitcoinMode ? 'Bitcoin Appreciation' : 'Fiat Erosion Tracker'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isBitcoinMode && (
              <button 
                onClick={() => setIsBitcoinMode(false)}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                Back to Fiat View
              </button>
            )}
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value as Region)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500/50 cursor-pointer text-white"
            >
              <option value={Region.UK}>UK (GBP)</option>
              <option value={Region.US}>USA (USD)</option>
              <option value={Region.EUROZONE}>EUROPE (EUR)</option>
            </select>
            
            <button 
              onClick={() => setIsBitcoinMode(!isBitcoinMode)}
              className={`p-2 rounded-lg border transition-all ${isBitcoinMode ? 'bg-orange-500 border-orange-400 text-black shadow-lg shadow-orange-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-orange-500'}`}
              title="Toggle BTC Mode"
            >
              ₿
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <h2 className="text-5xl font-extrabold tracking-tighter leading-tight">
              {isBitcoinMode 
                ? <>Escaping the <span className="text-orange-500 text-glow">inflation trap</span>.</>
                : <>Watch your <span className="text-blue-500">purchasing power</span> melt away.</>
              }
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-500 max-w-xl text-lg">
                {isBitcoinMode 
                  ? "See how your savings would have performed in the hardest money ever created."
                  : "Fiat currency is designed to lose value. Visualize the silent decay of your savings in real time."
                }
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-zinc-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-[10px] font-bold uppercase text-zinc-500 ml-1">
                {isBitcoinMode ? "Initial Capital" : "Current Savings"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{inflationData?.symbol || '£'}</span>
                <input 
                  type="number" 
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 w-full sm:w-56 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all tabular-nums text-white"
                />
              </div>
            </div>
            <button 
              onClick={() => loadData(true)}
              className={`h-[58px] px-8 rounded-xl font-black uppercase tracking-widest text-[10px] mt-auto w-full sm:w-auto transition-all flex items-center justify-center gap-2 ${isRefreshing || btcLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} bg-zinc-100 text-black`}
              disabled={isRefreshing || btcLoading}
            >
              {(isRefreshing || btcLoading) && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>}
              {isRefreshing || btcLoading ? 'Syncing...' : 'Refresh Data'}
            </button>
          </div>
        </section>

        {(loading || (isBitcoinMode && btcLoading)) ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className={`w-14 h-14 border-4 border-zinc-800 rounded-full animate-spin ${isBitcoinMode ? 'border-t-orange-500' : 'border-t-blue-500'}`}></div>
            <p className="text-zinc-500 animate-pulse uppercase tracking-[0.3em] text-[10px] font-black">
              {isBitcoinMode ? "Fetching Market History..." : "Syncing Macro Indicators..."}
            </p>
          </div>
        ) : inflationData && (
          <>
            <section className="space-y-6">
              {!isBitcoinMode ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Depreciation Monitor</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{inflationData.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <Ticker initialAmount={savings} data={inflationData} />
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="glass p-8 rounded-3xl border-orange-500/20 bg-orange-500/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <span className="text-6xl text-orange-500">₿</span>
                      </div>
                      <h3 className="text-xs font-bold text-orange-500 mb-4 uppercase tracking-[0.2em]">Investment Value Today</h3>
                      <div className={`text-5xl font-black font-mono tabular-nums mb-2 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)] ${btcSummary?.isLoss ? 'text-red-500' : 'text-orange-500'}`}>
                        {inflationData.symbol}{btcSummary?.currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <div className="flex items-center gap-3">
                         <span className={`px-2 py-1 text-black text-[10px] font-black rounded uppercase ${btcSummary?.isLoss ? 'bg-red-500' : 'bg-orange-500'}`}>
                            {btcSummary?.multiplier}x Return
                         </span>
                         <span className={`text-xs font-medium ${btcSummary?.isLoss ? 'text-red-400' : 'text-zinc-400'}`}>
                           {btcSummary?.isLoss ? '' : '+'}{btcSummary?.percent}% since {pastYears}y ago
                         </span>
                      </div>
                   </div>
                   <div className="glass p-8 rounded-3xl border-white/5 flex flex-col justify-center">
                      <h3 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-[0.2em]">BTC Market Detail ({inflationData.currency})</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Price {pastYears}y Ago:</span>
                          <span className="text-sm font-mono font-bold text-zinc-400">
                            {inflationData.symbol}{btcSummary?.startPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">Price Today:</span>
                          <span className={`text-sm font-mono font-bold ${btcSummary?.isLoss ? 'text-red-500' : 'text-orange-500'}`}>
                            {inflationData.symbol}{btcSummary?.endPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}
                          </span>
                        </div>
                        <div className="flex justify-end pt-2">
                           <span className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter">Updated: {btcSummary?.lastUpdated}</span>
                        </div>
                      </div>
                   </div>
                </div>
              )}
            </section>

            <section className="glass rounded-[2rem] p-8 md:p-12 space-y-12">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                <div className="max-w-xl">
                  <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">
                    {isBitcoinMode ? "Historical Performance" : "Purchasing Power Simulator"}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    {isBitcoinMode 
                      ? "Visualizing the performance of your capital if it had been stored in Bitcoin over the selected period."
                      : "Adjust the sliders to see how inflation eroded your wealth in the past and projected future decay."
                    }
                  </p>
                </div>
                
                <div className="flex flex-col gap-6 w-full lg:w-auto">
                   <div className="space-y-3 bg-zinc-950/40 p-5 rounded-2xl border border-white/5 shadow-inner min-w-[300px]">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lookback: {pastYears} Years</label>
                      </div>
                      <input 
                        type="range" min="1" max="15" value={pastYears}
                        onChange={(e) => setPastYears(Number(e.target.value))}
                        className={`w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer ${isBitcoinMode ? 'accent-orange-500' : 'accent-blue-500'}`}
                      />
                   </div>
                   {!isBitcoinMode && (
                      <div className="space-y-3 bg-zinc-950/40 p-5 rounded-2xl border border-white/5 shadow-inner min-w-[300px]">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase tracking-widest text-orange-500">Projection: {futureYears} Years</label>
                        </div>
                        <input 
                          type="range" min="1" max="40" value={futureYears}
                          onChange={(e) => setFutureYears(Number(e.target.value))}
                          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                      </div>
                   )}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase text-zinc-500">{isBitcoinMode ? "Chart Scale:" : "Future Modeling:"}</span>
                    <div className="flex gap-2">
                      {isBitcoinMode ? (
                        <>
                          <button 
                            onClick={() => setIsLogScale(false)}
                            title="Linear scale for short-term detail"
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${!isLogScale ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'}`}
                          >Linear</button>
                          <button 
                            onClick={() => setIsLogScale(true)}
                            title="Logarithmic scale to better visualize growth over long periods"
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all ${isLogScale ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'}`}
                          >Logarithmic</button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => setProjectionBasis(ProjectionBasis.CONSTANT)}
                            title="Uses latest published inflation rate as fixed for all future years"
                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${projectionBasis === ProjectionBasis.CONSTANT ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'}`}
                          >Constant Rate</button>
                          <button 
                            onClick={() => setProjectionBasis(ProjectionBasis.TREND)}
                            title="Uses historical average rate for more realistic projection based on recent trends"
                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${projectionBasis === ProjectionBasis.TREND ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/40 ring-2 ring-orange-500/20' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'}`}
                          >Trend Average</button>
                        </>
                      )}
                    </div>
                  </div>
                  {!isBitcoinMode && (
                    <div className="bg-zinc-900/40 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Active Forecast</span>
                        <span className="text-[10px] font-bold text-zinc-200">
                          {projectionBasis === ProjectionBasis.CONSTANT ? "Fixed Target Analysis" : "Historical Regression Model"}
                        </span>
                      </div>
                      <div className="h-6 w-px bg-white/10"></div>
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest">Official</span>
                          <span className="text-[10px] font-mono font-bold">{(currentProjectedRates?.official! * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-orange-400 tracking-widest">Alternative</span>
                          <span className="text-[10px] font-mono font-bold">{(currentProjectedRates?.alternative! * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative group">
                {/* Branding Watermark Overlay on Chart */}
                <div className="absolute bottom-12 right-6 z-10 opacity-30 pointer-events-none text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  @Peteradamj - Fiat Erosion Tracker
                </div>
                <HistoricalChart 
                  data={seriesPoints} 
                  btcData={btcPoints}
                  isBtcMode={isBitcoinMode}
                  isLogScale={isLogScale}
                  currencySymbol={inflationData.symbol}
                  key={`chart-${projectionBasis}-${region}-${isBitcoinMode}`}
                />
              </div>

              {isBitcoinMode && btcSummary && (
                <div className={`glass p-8 rounded-[2rem] border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 ${btcSummary.isLoss ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                      <p className="text-sm font-bold text-zinc-300">
                        {inflationData.symbol}{savings.toLocaleString()} invested {pastYears} years ago in Bitcoin is worth:
                      </p>
                      <h4 className={`text-4xl font-black tracking-tighter ${btcSummary.isLoss ? 'text-red-500' : 'text-orange-500'}`}>
                        {inflationData.symbol}{btcSummary.currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </h4>
                      <p className={`text-xs font-medium uppercase tracking-widest ${btcSummary.isLoss ? 'text-red-400' : 'text-orange-400'}`}>
                        {btcSummary.isLoss ? 'A net loss of' : 'A net gain of'} {btcSummary.percent}%
                      </p>
                    </div>
                    <button 
                      onClick={handleShare}
                      className={`px-8 py-4 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl ${btcSummary.isLoss ? 'bg-red-600 shadow-red-600/20' : 'bg-orange-600 shadow-orange-600/20'}`}
                    >Share Analysis</button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        <footer className="pt-16 pb-20 border-t border-white/5 text-center space-y-8">
          <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            <a href="https://www.ons.gov.uk/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors">ONS Data</a>
            <a href="https://www.shadowstats.com/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors">ShadowStats</a>
            <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-100 transition-colors">CoinGecko Feed</a>
          </div>
          <p className="text-[10px] text-zinc-600 max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-tight">
            Historical and projection models for educational purposes. Bitcoin market data provided by CoinGecko. Not financial advice.
          </p>
          <div className={`inline-flex items-center px-8 py-4 rounded-2xl border transition-all ${isBitcoinMode ? 'bg-orange-500 border-orange-400 text-black shadow-2xl' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-orange-500/50'}`}>
            <a href="https://bitcoin.org/bitcoin.pdf" target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4 flex items-center gap-2">
              Whitepaper: Bitcoin Standard
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        </footer>
      </main>
      <Analytics />
    </div>
  );
};

export default App;
