import React from 'react';
import WatermarkRemover from '@/components/WatermarkRemover';
import ComparisonTable from '@/components/ComparisonTable';
import TechnicalGuide from '@/components/TechnicalGuide';
import FAQSection from '@/components/FAQSection';
import AdsterraLeaderboard from '@/components/ads/AdsterraLeaderboard';
import AdsterraNative from '@/components/ads/AdsterraNative';
import AdsterraRectangle from '@/components/ads/AdsterraRectangle';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-950/60 border border-violet-800/60 text-violet-300 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Lossless Reverse Alpha Blending Engine • 100% Free Forever</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">Gemini Watermark Remover</span> Online
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Remove visible sparkle watermarks from Google Gemini AI images in 5ms. 100% client-side in your browser, zero server uploads, lossless original quality, and zero $1 paywalls.
        </p>

        {/* Hero interactive workspace */}
        <WatermarkRemover />
      </section>

      {/* Adsterra Top Leaderboard Banner (728x90) */}
      <AdsterraLeaderboard />

      {/* Comparison against competitors */}
      <ComparisonTable />

      {/* Adsterra Native Banner (4:1 Responsive Grid) */}
      <AdsterraNative />

      {/* In-depth E-E-A-T Technical Guide */}
      <TechnicalGuide />

      {/* Adsterra 300x250 Medium Rectangle Showcase */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8 flex flex-col sm:flex-row items-center justify-center gap-8 bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6 sm:p-8">
        <div className="max-w-md text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-300 mb-3">
            <Zap className="w-3.5 h-3.5" />
            Recommended Partner Network
          </span>
          <h3 className="text-xl font-bold text-white mb-2">
            Explore Leading AI Productivity Tools
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Support our free, open tool! Discover vetted high-speed AI tools, cloud renderers, and creative suites tailored for digital artists.
          </p>
          <a
            href="https://www.profitableratecpmnetwork.com/svs5a2hemw?key=c0a315ccabf0b9ea629fb53f2b267476"
            target="_blank"
            rel="noopener sponsored"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-lg shadow-violet-600/20 transition-all"
          >
            <span>Explore Partner Offers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <AdsterraRectangle />
      </div>

      {/* FAQ Accordion Section */}
      <FAQSection />

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl bg-gradient-to-b from-violet-950/40 to-slate-900 border border-violet-800/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Clean Your Gemini AI Images?
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            No credit card, no email registration, and no server upload required. Run locally in your browser right now.
          </p>
          <a
            href="#tool"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Start Removing Now (100% Free)
          </a>
        </div>
      </section>
    </div>
  );
}
