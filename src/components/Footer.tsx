import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            </div>
          </div>
          <div>
            <div className="font-bold text-sm text-slate-200">
              GeminiWatermark<span className="text-violet-400">AI</span>.online
            </div>
            <p className="text-[11px] text-slate-400">
              100% Free Client-Side Reverse Alpha Blending Engine.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
          <Link href="/about" className="hover:text-violet-300 transition-colors">About Us</Link>
          <Link href="/privacy" className="hover:text-violet-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-violet-300 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-violet-300 transition-colors">Contact Support</Link>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} GeminiWatermarkAI. All rights reserved.</p>
          <p className="mt-0.5">Google, Gemini, and Imagen are trademarks of Google LLC.</p>
        </div>
      </div>
    </footer>
  );
}
