
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down';
  color?: 'orange' | 'red' | 'green' | 'zinc';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, trend, color = 'zinc' }) => {
  const colorMap = {
    orange: 'text-orange-500',
    red: 'text-red-500',
    green: 'text-emerald-500',
    zinc: 'text-zinc-400'
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold ${colorMap[color]}`}>{value}</span>
        {trend && (
          <span className={`text-xs ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend === 'up' ? '▲' : '▼'}
          </span>
        )}
      </div>
      {subtext && <span className="text-xs text-zinc-500">{subtext}</span>}
    </div>
  );
};
