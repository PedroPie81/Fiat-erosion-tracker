
import React, { useMemo } from 'react';

interface QuirkyMeltAnimationProps {
  rate: number;
  symbol: string;
}

export const QuirkyMeltAnimation: React.FC<QuirkyMeltAnimationProps> = ({ rate, symbol }) => {
  // Map rate to animation duration (higher rate = faster melt)
  // 2% -> 10s, 10% -> 2s
  const duration = useMemo(() => {
    const d = Math.max(1.5, 12 - (rate * 100));
    return `${d.toFixed(1)}s`;
  }, [rate]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 glass rounded-[2rem] border-dashed border-zinc-700/50 relative overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Real-Time Decay Visualizer</span>
      </div>

      <div className="relative w-64 h-40 group">
        {/* The Melting Banknote */}
        <div 
          className="absolute inset-0 bg-emerald-900/40 border-2 border-emerald-500/30 rounded-xl flex items-center justify-center overflow-hidden shadow-2xl"
          style={{
            animation: `melt ${duration} infinite ease-in-out`,
            transformOrigin: 'top center'
          }}
        >
          {/* Banknote Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
          
          <div className="flex flex-col items-center gap-1 z-10">
            <span className="text-4xl font-black text-emerald-400/80 drop-shadow-md">{symbol}</span>
            <div className="px-3 py-0.5 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter italic">Help, I'm melting!</span>
            </div>
          </div>

          {/* Drip Effects */}
          <div className="absolute bottom-0 left-1/4 w-3 h-8 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute bottom-0 right-1/3 w-2 h-12 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-4 h-6 bg-emerald-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Puddle below */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-emerald-500/10 rounded-[100%] blur-xl transition-all duration-1000"
          style={{
            transform: `translateX(-50%) scale(${1 + (rate * 5)})`,
            opacity: 0.3 + (rate * 2)
          }}
        ></div>
      </div>

      <div className="mt-12 text-center space-y-2">
        <p className="text-sm font-bold text-zinc-400">Current annual rate (~{(rate * 100).toFixed(1)}%) is liquefying your purchasing power.</p>
        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600">Observation: The floor is becoming more valuable than the note.</p>
      </div>

      <style>{`
        @keyframes melt {
          0%, 100% {
            transform: scaleY(1) translateY(0);
            border-radius: 12px;
            filter: hue-rotate(0deg);
          }
          50% {
            transform: scaleY(0.7) translateY(15px) skewX(2deg);
            border-radius: 12px 12px 40px 40px;
            filter: hue-rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};
