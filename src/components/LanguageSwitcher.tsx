'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Globe, ChevronDown } from 'lucide-react';
import { LOCALES, SUPPORTED_LOCALES } from '@/lib/i18n/config';

interface Props {
  currentLocale?: string;
}

export default function LanguageSwitcher({ currentLocale = 'en' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLocale = LOCALES[currentLocale] || LOCALES.en;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium transition-all"
        aria-label="Select Language"
      >
        <span className="text-sm">{activeLocale.flag}</span>
        <span className="hidden sm:inline">{activeLocale.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Languages
          </div>
          {SUPPORTED_LOCALES.map((code) => {
            const loc = LOCALES[code];
            const isCurrent = code === currentLocale;
            return (
              <Link
                key={code}
                href={loc.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                  isCurrent
                    ? 'bg-violet-600/20 text-violet-300 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{loc.flag}</span>
                  <span>{loc.nativeName}</span>
                </div>
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
