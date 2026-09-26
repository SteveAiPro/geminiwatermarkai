'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraRectangle() {
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
          'key' : 'c55e244986568a6eb65fd70f7a9fe59e',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highrevenueformat.com/c55e244986568a6eb65fd70f7a9fe59e/invoke.js';

      containerRef.current.appendChild(atOptionsScript);
      containerRef.current.appendChild(invokeScript);
    } catch (e) {
      console.error('Adsterra Rectangle load error', e);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="flex items-center gap-2 mb-1.5 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
        <span>Sponsored 300x250</span>
      </div>
      <div
        ref={containerRef}
        className="w-[300px] h-[250px] bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center justify-center overflow-hidden shadow-inner"
      />
    </div>
  );
}
