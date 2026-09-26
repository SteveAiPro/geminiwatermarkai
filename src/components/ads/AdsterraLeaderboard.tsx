'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraLeaderboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.adLoaded) return;
    containerRef.current.dataset.adLoaded = 'true';

    try {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `
        atOptions = {
          'key' : 'ec366bc6c1284f4d27112e90d6878579',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highrevenueformat.com/ec366bc6c1284f4d27112e90d6878579/invoke.js';

      containerRef.current.appendChild(atOptionsScript);
      containerRef.current.appendChild(invokeScript);
    } catch (e) {
      console.error('Adsterra Leaderboard load error', e);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 px-4">
      <div className="flex items-center gap-2 mb-1.5 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
        <span>Sponsored Advertisement</span>
      </div>
      <div
        ref={containerRef}
        className="w-full max-w-[728px] min-h-[90px] bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center justify-center overflow-hidden shadow-inner"
      />
    </div>
  );
}
