'use client';

import { useEffect, useRef } from 'react';

export default function AdsterraNative() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.adLoaded) return;
    containerRef.current.dataset.adLoaded = 'true';

    try {
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31519277.profitableratecpmnetwork.com/b9a0003347513036ca7ff7563f625454/invoke.js';

      containerRef.current.appendChild(script);
    } catch (e) {
      console.error('Adsterra Native Banner load error', e);
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Sponsored Recommendations
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Adsterra Verified</span>
      </div>
      <div
        ref={containerRef}
        className="w-full min-h-[140px] bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden backdrop-blur-sm"
      >
        <div id="container-b9a0003347513036ca7ff7563f625454" />
      </div>
    </div>
  );
}
