import React, { useState, useEffect, useRef } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={tooltipRef}
      className="relative flex items-center cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto mb-2 w-64 p-3 bg-zinc-800 text-xs text-zinc-200 rounded-lg shadow-xl z-20 pointer-events-none">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
