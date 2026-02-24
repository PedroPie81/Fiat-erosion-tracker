
import React, { useState, useRef } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Use a slight delay for smoothing entry/exit and preventing flickering
  const handleMouseEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setShow(true);
  };

  const handleMouseLeave = () => {
    // Small delay before hiding to prevent flicker if user moves over the "bridge" gap
    timeoutRef.current = window.setTimeout(() => {
      setShow(false);
    }, 100);
  };

  return (
    <div className="relative inline-flex items-center">
      <div 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help flex items-center justify-center text-zinc-500 hover:text-[#f97316] transition-colors p-1 -m-1"
      >
        {children}
      </div>
      
      {/* Tooltip Content */}
      <div 
        className={`absolute z-[100] bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 p-3 bg-zinc-900 text-xs text-zinc-100 rounded-lg shadow-2xl border border-zinc-700/50 pointer-events-none transition-all duration-200 origin-bottom ${
          show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'
        }`}
      >
        <div className="relative z-10">{text}</div>
        {/* Border accent at bottom */}
        <div className="absolute inset-0 border-b-2 border-transparent hover:border-[#f97316] rounded-lg transition-colors"></div>
        {/* Tail */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-8 border-transparent border-t-zinc-900"></div>
      </div>
    </div>
  );
};

export default Tooltip;
