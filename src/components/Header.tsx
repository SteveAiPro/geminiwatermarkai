'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, BookOpen } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
              GeminiWatermark<span className="text-violet-400">AI</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">Free</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/#tool" className="hover:text-violet-400 transition-colors">Tool</Link>
          <Link href="/#how-it-works" className="hover:text-violet-400 transition-colors">How It Works</Link>
          <Link href="/#comparison" className="hover:text-violet-400 transition-colors">Why Free?</Link>
          <Link href="/blog" className="hover:text-violet-400 transition-colors flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-violet-400" />
            <span>Blog &amp; Guides</span>
          </Link>
          <Link href="/#faq" className="hover:text-violet-400 transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side</span>
          </div>

          <Link
            href="/#tool"
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg shadow-md shadow-violet-500/20 transition-all"
          >
            Remove Watermark
          </Link>
        </div>
      </div>
    </header>
  );
}
