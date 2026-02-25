import React, { useEffect, useRef } from 'react';

export const AdsterraBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;
    
    // Prevent multiple injections
    if (bannerRef.current.firstChild) return;

    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `
      atOptions = {
        'key' : '7c4b676be82520a60d9f17ec67d67b03',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://www.highperformanceformat.com/7c4b676be82520a60d9f17ec67d67b03/invoke.js";
    script.async = true;

    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center overflow-hidden my-4">
      <div ref={bannerRef} />
    </div>
  );
};
