'use client';

import Script from 'next/script';

export default function AdsterraScripts() {
  return (
    <>
      {/* Adsterra Popunder Script (Placement ID: 31418772) */}
      <Script
        id="adsterra-popunder"
        strategy="afterInteractive"
        src="https://pl31519271.profitableratecpmnetwork.com/7f/70/c5/7f70c59eed64d60ac85f4dec83d9c39a.js"
      />

      {/* Adsterra Social Bar Script (Placement ID: 31418774) */}
      <Script
        id="adsterra-socialbar"
        strategy="lazyOnload"
        src="https://pl31519273.profitableratecpmnetwork.com/1c/ca/dc/1ccadcb7aaea9aab6ce58c8d3171ab26.js"
      />
    </>
  );
}
