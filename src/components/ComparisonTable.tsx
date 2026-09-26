'use client';

import React from 'react';
import { Check, X, Shield, Zap, Sparkles, DollarSign } from 'lucide-react';

export default function ComparisonTable() {
  return (
    <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
          Why GeminiWatermarkAI?
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-4 tracking-tight">
          Don&apos;t Pay $1 for What Your Browser Can Do in 5ms
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm">
          Other services charge subscriptions and upload your private images to remote servers for a task that is solved with a simple mathematical formula. Here is how we compare.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm shadow-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-300">
              <th className="py-4 px-6">Feature</th>
              <th className="py-4 px-6 text-violet-400 bg-violet-950/30 border-x border-violet-500/20">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  GeminiWatermarkAI (Us)
                </div>
              </th>
              <th className="py-4 px-6 text-slate-400">geminiwatermark.io</th>
              <th className="py-4 px-6 text-slate-400">Generic AI Inpainters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            <tr>
              <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Pricing
              </td>
              <td className="py-4 px-6 bg-violet-950/20 border-x border-violet-500/20 font-bold text-emerald-400">
                100% Free Forever
              </td>
              <td className="py-4 px-6 text-rose-400">$1/day trial, then $7/mo</td>
              <td className="py-4 px-6 text-slate-400">Credit packs / $10+ mo</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                Privacy &amp; Security
              </td>
              <td className="py-4 px-6 bg-violet-950/20 border-x border-violet-500/20 font-semibold text-slate-200">
                100% Local Browser (0 Upload)
              </td>
              <td className="py-4 px-6 text-slate-400">Uploaded to remote cloud</td>
              <td className="py-4 px-6 text-slate-400">Stored on 3rd-party servers</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-medium text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Processing Speed
              </td>
              <td className="py-4 px-6 bg-violet-950/20 border-x border-violet-500/20 font-bold text-emerald-400">
                ~5ms (Instant Canvas)
              </td>
              <td className="py-4 px-6 text-slate-400">10 ~ 20s server roundtrip</td>
              <td className="py-4 px-6 text-slate-400">30s+ GPU queue</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-medium text-white">Algorithm &amp; Quality</td>
              <td className="py-4 px-6 bg-violet-950/20 border-x border-violet-500/20 font-semibold text-slate-200">
                Mathematical Reverse Alpha (Exact)
              </td>
              <td className="py-4 px-6 text-slate-400">Reverse Alpha / Filter</td>
              <td className="py-4 px-6 text-slate-400">AI Hallucinations / Blur</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-medium text-white">Account &amp; Registration</td>
              <td className="py-4 px-6 bg-violet-950/20 border-x border-violet-500/20 font-bold text-emerald-400">
                Zero Sign-Up Required
              </td>
              <td className="py-4 px-6 text-slate-400">Email &amp; Credit Card Required</td>
              <td className="py-4 px-6 text-slate-400">Mandatory Login</td>
            </tr>
            <tr>
              <td className="py-4 px-6 font-medium text-white">Download Limitations</td>
              <td className="py-4 px-6 bg-violet-950/20 border-x border-violet-500/20 font-bold text-emerald-400">
                Unlimited Full Resolution
              </td>
              <td className="py-4 px-6 text-slate-400">Paywalled after 1st try</td>
              <td className="py-4 px-6 text-slate-400">Compressed / Low DPI</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
