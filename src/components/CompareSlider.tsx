'use client';

import React, { useState, useRef, useCallback } from 'react';

interface CompareSliderProps {
  originalUrl: string;
  cleanedUrl: string;
  className?: string;
}

export default function CompareSlider({ originalUrl, cleanedUrl, className = '' }: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  }, [handleMove]);

  const startDrag = () => {
    isDragging.current = true;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl cursor-ew-resize ${className}`}
      onMouseDown={startDrag}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onMouseMove={handleMouseMove}
      onTouchStart={startDrag}
      onTouchEnd={stopDrag}
      onTouchMove={handleTouchMove}
    >
      {/* Cleaned Image (Base Layer - Right / Cleaned) */}
      <img
        src={cleanedUrl}
        alt="Cleaned without watermark"
        className="w-full h-auto block object-contain max-h-[560px] mx-auto pointer-events-none"
      />

      {/* Original Image (Overlay Layer - Left / Watermarked) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={originalUrl}
          alt="Original with Gemini watermark"
          className="w-full h-auto block object-contain max-h-[560px] mx-auto"
        />
      </div>

      {/* Divider Bar */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle circle */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
          ↔
        </div>
      </div>

      {/* Pill Labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-700 text-xs font-semibold text-rose-300 backdrop-blur-sm pointer-events-none">
        Original (With Watermark)
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/70 border border-slate-700 text-xs font-semibold text-emerald-300 backdrop-blur-sm pointer-events-none">
        Cleaned (Lossless 100%)
      </div>
    </div>
  );
}
