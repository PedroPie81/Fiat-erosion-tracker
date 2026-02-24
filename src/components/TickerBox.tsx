import React, { useEffect, useState } from 'react';
import { CurrencyConfig } from '../types';
import Tooltip from './Tooltip';

interface TickerBoxProps {
  label: string;
  tooltipText: string;
  initialValue: number;
  annualRate: number;
  config: CurrencyConfig;
}

type TimeInterval = 'Year' | 'Month' | 'Week' | 'Day' | 'Hour';

const TickerBox: React.FC<TickerBoxProps> = ({ label, tooltipText, initialValue, annualRate, config }) => {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [intervalType, setIntervalType] = useState<TimeInterval>('Year');

  useEffect(() => {
    setCurrentValue(initialValue);
    // Simulate live depreciation
    const decayPerSecond = annualRate / (365.25 * 24 * 60 * 60);
    const interval = setInterval(() => {
      setCurrentValue(prev => prev * (1 - decayPerSecond));
    }, 1000);
    return () => clearInterval(interval);
  }, [initialValue, annualRate]);

  const getIntervalRate = () => {
    switch (intervalType) {
      case 'Hour': return annualRate / (365.25 * 24);
      case 'Day': return annualRate / 365.25;
      case 'Week': return annualRate / 52.14;
      case 'Month': return annualRate / 12;
      case 'Year': return annualRate;
    }
  };

  const formatRate = (rate: number) => {
    const percentage = rate * 100;
    // Show more decimals for smaller intervals
    if (intervalType === 'Year' || intervalType === 'Month') {
      return percentage.toFixed(2);
    } else if (intervalType === 'Week' || intervalType === 'Day') {
      return percentage.toFixed(4);
    } else {
      return percentage.toFixed(6);
    }
  };

  const intervalRate = getIntervalRate();
  const monetaryLoss = initialValue * intervalRate;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-500">{label}</h3>
        <Tooltip text={tooltipText}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 hover:text-zinc-300 transition-colors"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </Tooltip>
      </div>
      
      <div className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-white tracking-tighter mb-6">
        {config.symbol}{currentValue.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}
      </div>
      
      <div className="flex flex-col items-center gap-1 bg-zinc-950/50 px-5 py-3 rounded-xl border border-zinc-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-mono font-bold text-red-400">
            -{config.symbol}{monetaryLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: intervalType === 'Hour' ? 4 : 2 })}
          </span>
          <span className="text-zinc-500 text-lg">/</span>
          <div className="relative flex items-center">
            <select
              value={intervalType}
              onChange={(e) => setIntervalType(e.target.value as TimeInterval)}
              className="bg-transparent text-zinc-300 text-lg font-bold focus:outline-none cursor-pointer appearance-none hover:text-white transition-colors pr-4"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
            >
              <option value="Hour" className="bg-zinc-900 text-zinc-300">hour</option>
              <option value="Day" className="bg-zinc-900 text-zinc-300">day</option>
              <option value="Week" className="bg-zinc-900 text-zinc-300">week</option>
              <option value="Month" className="bg-zinc-900 text-zinc-300">month</option>
              <option value="Year" className="bg-zinc-900 text-zinc-300">year</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 absolute right-0 pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          (-{formatRate(intervalRate)}%)
        </div>
      </div>
    </div>
  );
};

export default TickerBox;
