import React from 'react';
import { Sparkles, Users, Code2, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: "About Us | GeminiWatermarkAI",
  description: "Learn about GeminiWatermarkAI: why we built a 100% free, client-side watermark removal engine.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">About GeminiWatermarkAI</h1>
          <p className="text-xs text-slate-400">Open-Source Mathematics for Digital Creators</p>
        </div>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border-t border-slate-800 pt-6">
        <section>
          <h2 className="text-base font-bold text-white mb-2">Our Mission: Stop Exploitative Paywalls</h2>
          <p>
            When Google introduced Gemini&apos;s visible sparkle watermark, independent creators immediately faced a dilemma: either accept ruined corners in their artwork, or pay $1 trials and $7 monthly subscriptions to predatory websites that simply ran open-source code behind closed walls.
          </p>
          <p className="mt-2">
            We built <strong>GeminiWatermarkAI</strong> to prove that useful web tools can be completely free, privacy-preserving, and lightning fast by computing locally inside your browser instead of wasting cloud resources.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">How We Do It For Free</h2>
          <p>
            Because we use client-side HTML5 Canvas and Reverse Alpha Blending, your device&apos;s CPU does the calculation in under 10 milliseconds. We host only static HTML and JavaScript assets via global edge networks (Cloudflare / Vercel), meaning our hosting costs are virtually zero.
          </p>
          <p className="mt-2 text-violet-300 font-medium">
            No expensive GPUs = No server costs = No subscriptions for you.
          </p>
        </section>
      </div>
    </div>
  );
}
