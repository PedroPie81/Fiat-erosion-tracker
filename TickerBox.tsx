
import React, { useState, useEffect, useRef } from 'react';
import { CurrencyConfig } from '../types';
import Tooltip from './Tooltip';

interface TickerBoxProps {
  label: string;
  tooltipText: string;
  initialValue: number;
  annualRate: number;
  config: CurrencyConfig;
}

// NEW: Types and constants for time period selection
type PeriodType = 'hour' | 'day' | 'week' | 'month' | 'year';

const PERIOD_CONFIG: Record<PeriodType, { label: string; divisor: number }> = {
  hour: { label: 'hour', divisor: 365 * 24 },
  day: { label: 'day', divisor: 365 },
  week: { label: 'week', divisor: 52 },
  month: { label: 'month', divisor: 12 },
  year: { label: 'year', divisor: 1 },
};

const TickerBox: React.FC<TickerBoxProps> = ({ label, tooltipText, initialValue, annualRate, config }) => {
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [period, setPeriod] = useState<PeriodType>('hour');
  const startTimeRef = useRef(Date.now());
  
  // Ticker Logic (Always based on ms for smooth animation)
  const annualLoss = initialValue * annualRate;
  const msLoss = annualLoss / (365 * 24 * 60 * 60 * 1000);

  // UPDATED: Dynamic loss calculation based on selected period
  const periodLoss = annualLoss / PERIOD_CONFIG[period].divisor;

  useEffect(() => {
    startTimeRef.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentLoss = elapsed * msLoss;
      setDisplayValue(initialValue - currentLoss);
      requestAnimationFrame(tick);
    };
    
    const animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [initialValue, msLoss]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col gap-2 relative group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400 font-medium text-sm">
          {label}
          <Tooltip text={tooltipText}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </Tooltip>
        </div>
      </div>

      <div className="text-2xl md:text-3xl font-bold mono tracking-tight text-white my-1">
        {config.symbol}{displayValue.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-auto">
        <div className="text-[#f97316] font-medium flex items-center gap-1 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 14-7 7-7-7"/><path d="M12 21V3"/></svg>
          -{config.symbol}{periodLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        
        {/* NEW: Dropdown selector for the period */}
        <div className="flex items-center">
          <label htmlFor={`period-select-${label}`} className="sr-only">Select Period</label>
          <div className="relative inline-block text-zinc-500">
            <select
              id={`period-select-${label}`}
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodType)}
              className="appearance-none bg-transparent pl-1 pr-6 py-0.5 text-sm font-semibold text-zinc-500 hover:text-[#f97316] focus:outline-none cursor-pointer transition-colors"
            >
              <option value="hour">per hour</option>
              <option value="day">per day</option>
              <option value="week">per week</option>
              <option value="month">per month</option>
              <option value="year">per year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-zinc-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickerBox;
