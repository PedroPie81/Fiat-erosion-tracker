
import React, { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  ReferenceLine,
  Label
} from 'recharts';
import { HistoricalPoint, BtcPoint } from '../types';

interface HistoricalChartProps {
  data: HistoricalPoint[];
  btcData?: BtcPoint[];
  isBtcMode: boolean;
  isLogScale?: boolean;
  currencySymbol: string;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ 
  data, 
  btcData, 
  isBtcMode, 
  isLogScale = false,
  currencySymbol 
}) => {
  const currentYear = new Date().getFullYear();
  
  const btcPerformance = useMemo(() => {
    if (isBtcMode && btcData && btcData.length > 1) {
      const start = btcData[0].price;
      const end = btcData[btcData.length - 1].price;
      const currentPrice = btcData[btcData.length - 1].price;
      return {
        isLoss: end < start,
        currentPrice
      };
    }
    return { isLoss: false, currentPrice: 0 };
  }, [isBtcMode, btcData]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-xl border border-white/10 shadow-2xl min-w-[200px] animate-in fade-in duration-200">
          <p className="text-zinc-400 text-[10px] mb-2 font-black uppercase tracking-widest">{isBtcMode ? 'Date' : 'Year'}: {label}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.value === null || entry.value === undefined) return null;
            return (
              <div key={index} className="flex justify-between gap-8 items-center mb-1">
                <span className="text-[9px] uppercase font-black tracking-tight" style={{ color: entry.color }}>
                  {entry.name.replace('Projected', '').trim()}
                </span>
                <span className="text-xs font-mono font-bold text-zinc-100">
                  {currencySymbol}{entry.value.toLocaleString(undefined, { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Generate nice power-of-10 and 2x/5x ticks for Log scale to show volatility detail
  const logTicks = useMemo(() => {
    if (!isBtcMode || !isLogScale || !btcData || btcData.length === 0) return undefined;
    const values = btcData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    const ticks = [];
    let start = Math.pow(10, Math.floor(Math.log10(min)));
    if (start > min) start /= 10;

    while (start <= max * 5) {
      if (start > 0) {
        ticks.push(start);
        // Add 2x and 5x midpoints for more density on large log ranges
        if (start * 2 < max * 5) ticks.push(start * 2);
        if (start * 5 < max * 5) ticks.push(start * 5);
      }
      start *= 10;
    }
    // Filter to only those in meaningful range to avoid cluttered axis
    return [...new Set(ticks)].filter(t => t >= min * 0.5 && t <= max * 2).sort((a, b) => a - b);
  }, [isBtcMode, isLogScale, btcData]);

  if (isBtcMode && btcData && btcData.length > 0) {
    const mainColor = btcPerformance.isLoss ? '#ef4444' : '#f97316';

    return (
      <div className="w-full h-[450px] mt-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={btcData} margin={{ top: 30, right: 10, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="colorBtcValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={mainColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} strokeOpacity={0.3} />
            <XAxis 
              dataKey="dateLabel" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={15}
              minTickGap={60}
              tick={{ fontWeight: 600 }}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              scale={isLogScale ? "log" : "linear"}
              domain={['auto', 'auto']}
              ticks={isLogScale ? logTicks : undefined}
              tickFormatter={(val) => `${currencySymbol}${val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
              tick={{ fontWeight: 600 }}
            />
            <Tooltip content={customTooltip} cursor={{ stroke: mainColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Legend 
              verticalAlign="top" 
              height={45} 
              wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', paddingBottom: '30px' }}
            />
            
            <ReferenceLine 
              x={btcData[btcData.length - 1].dateLabel} 
              stroke={mainColor} 
              strokeWidth={1} 
              strokeDasharray="3 3"
            >
              <Label 
                value={`NOW: ${currencySymbol}${btcPerformance.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                position="top" 
                fill={mainColor} 
                fontSize={10} 
                fontWeight={900} 
                offset={10}
              />
            </ReferenceLine>

            <Area 
              name="Investment Value (BTC)" 
              type="monotone" 
              dataKey="value" 
              stroke={mainColor} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBtcValue)" 
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: mainColor, className: 'animate-pulse' }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (isBtcMode) {
    return (
      <div className="w-full h-[450px] mt-8 flex items-center justify-center glass rounded-3xl border-dashed border-zinc-800">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Resolving Market Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] mt-8 animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorOfficial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} strokeOpacity={0.3} />
          <XAxis 
            dataKey="year" 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={15}
            tick={{ fontWeight: 600 }}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`}
            tick={{ fontWeight: 600 }}
          />
          <Tooltip content={customTooltip} cursor={{ stroke: '#52525b', strokeWidth: 1 }} />
          <Legend 
            verticalAlign="top" 
            height={45} 
            wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em', paddingBottom: '30px' }}
          />
          
          <ReferenceLine x={currentYear} stroke="#71717a" strokeDasharray="3 3">
            <Label value="TODAY" position="top" fill="#71717a" fontSize={10} fontWeight={900} offset={10} />
          </ReferenceLine>

          <Area 
            name="Official Past Power" 
            type="monotone" 
            dataKey="realOfficial" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorOfficial)" 
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area 
            name="Alt Past Power" 
            type="monotone" 
            dataKey="realAlternative" 
            stroke="#f97316" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorAlt)" 
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />

          <Area 
            name="Official Future Erosion" 
            type="monotone" 
            dataKey="realOfficialProjected" 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="transparent"
            dot={false}
          />
          <Area 
            name="Alt Future Erosion" 
            type="monotone" 
            dataKey="realAlternativeProjected" 
            stroke="#f97316" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="transparent"
            dot={false}
          />

          <Area 
            name="Nominal Level" 
            type="monotone" 
            dataKey="nominal" 
            stroke="#52525b" 
            strokeWidth={1}
            fill="transparent"
            dot={false}
            strokeOpacity={0.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
