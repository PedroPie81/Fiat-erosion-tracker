
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InflationData } from '../types';
import { SECONDS_IN_YEAR } from '../constants';

interface TickerProps {
  initialAmount: number;
  data: InflationData;
}

type Timeframe = 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * A sub-component dedicated to high-frequency numeric updates.
 * By isolating the 100ms interval here, the parent (with the dropdowns) 
 * does not re-render 10 times a second, ensuring UI stability.
 */
const LiveCounter: React.FC<{ 
  initialAmount: number; 
  dps: number; 
  formatter: Intl.NumberFormat;
  colorClass: string;
}> = ({ initialAmount, dps, formatter, colorClass }) => {
  const [value, setValue] = useState(initialAmount);
  
  // Use a ref to always have the latest initialAmount if it changes
  const initialRef = useRef(initialAmount);
  useEffect(() => {
    initialRef.current = initialAmount;
    setValue(initialAmount);
  }, [initialAmount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => prev - (dps / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [dps]);

  return (
    <div className={`text-4xl lg:text-5xl font-mono font-bold tabular-nums mb-6 transition-all ${colorClass}`}>
      {formatter.format(value)}
    </div>
  );
};

export const Ticker: React.FC<TickerProps> = ({ initialAmount, data }) => {
  const [offTimeframe, setOffTimeframe] = useState<Timeframe>('hour');
  const [altTimeframe, setAltTimeframe] = useState<Timeframe>('hour');

  // Depreciation per second calculations
  const officialDps = useMemo(() => (initialAmount * data.officialRate) / SECONDS_IN_YEAR, [initialAmount, data.officialRate]);
  const alternativeDps = useMemo(() => (initialAmount * data.alternativeRate) / SECONDS_IN_YEAR, [initialAmount, data.alternativeRate]);

  // Annual losses for static display
  const officialAnnualLoss = initialAmount * data.officialRate;
  const alternativeAnnualLoss = initialAmount * data.alternativeRate;

  const mainFormatter = useMemo(() => new Intl.NumberFormat(data.currency === 'GBP' ? 'en-GB' : 'en-US', {
    style: 'currency',
    currency: data.currency,
    minimumFractionDigits: 4,
  }), [data.currency]);

  const lossFormatter = useMemo(() => new Intl.NumberFormat(data.currency === 'GBP' ? 'en-GB' : 'en-US', {
    style: 'currency',
    currency: data.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }), [data.currency]);

  const getLossValue = (annualLoss: number, timeframe: Timeframe) => {
    switch (timeframe) {
      case 'hour': return annualLoss / (365.25 * 24);
      case 'day': return annualLoss / 365.25;
      case 'week': return annualLoss / 52.1786;
      case 'month': return annualLoss / 12;
      case 'year': return annualLoss;
      default: return annualLoss / (365.25 * 24);
    }
  };

  const TimeframeSelector = ({ value, onChange, colorClass }: { value: Timeframe, onChange: (v: Timeframe) => void, colorClass: string }) => (
    <div className="relative inline-block">
      <select 
        value={value}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value as Timeframe);
        }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-zinc-900/80 border border-zinc-800/50 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${colorClass} focus:outline-none focus:ring-2 focus:ring-current/30 transition-all cursor-pointer appearance-none pr-8 hover:bg-zinc-800`}
      >
        <option value="hour">per hour</option>
        <option value="day">per day</option>
        <option value="week">per week</option>
        <option value="month">per month</option>
        <option value="year">per year</option>
      </select>
      <div className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 ${colorClass}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Official Ticker */}
      <div className="glass p-8 rounded-3xl relative overflow-hidden group border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <svg className="w-24 h-24 text-zinc-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6h-6z"/>
          </svg>
        </div>
        <h3 className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-[0.2em]">Official CPI Purchasing Power</h3>
        
        <LiveCounter 
          initialAmount={initialAmount} 
          dps={officialDps} 
          formatter={mainFormatter} 
          colorClass="text-zinc-100"
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
            <span className="animate-pulse">●</span>
            <span>Losing {lossFormatter.format(getLossValue(officialAnnualLoss, offTimeframe))}</span>
          </div>
          <TimeframeSelector value={offTimeframe} onChange={setOffTimeframe} colorClass="text-red-500" />
        </div>
      </div>

      {/* Alternative Ticker */}
      <div className="glass p-8 rounded-3xl border-orange-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-24 h-24 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6h-6z"/>
          </svg>
        </div>
        <h3 className="text-xs font-bold text-orange-500/80 mb-2 uppercase tracking-[0.2em]">Alternative Estimate Power</h3>
        
        <LiveCounter 
          initialAmount={initialAmount} 
          dps={alternativeDps} 
          formatter={mainFormatter} 
          colorClass="text-orange-500 text-glow"
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
            <span className="animate-pulse">●</span>
            <span>Losing {lossFormatter.format(getLossValue(alternativeAnnualLoss, altTimeframe))}</span>
          </div>
          <TimeframeSelector value={altTimeframe} onChange={setAltTimeframe} colorClass="text-orange-400" />
        </div>
      </div>
    </div>
  );
};
