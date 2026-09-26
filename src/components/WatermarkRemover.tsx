'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Download, Sparkles, RefreshCw, CheckCircle2, ShieldCheck, Zap, Image as ImageIcon } from 'lucide-react';
import CompareSlider from './CompareSlider';
import { removeGeminiWatermark, ProcessResult } from '@/lib/watermarkEngine';

export default function WatermarkRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setSelectedFile(file);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = async () => {
          try {
            const res = await removeGeminiWatermark(img);
            setResult(res);
          } catch (err: any) {
            setErrorMessage(err.message || 'Failed to process watermark.');
          } finally {
            setIsProcessing(false);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading file.');
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const downloadCleanedImage = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.cleanedImageDataUrl;
    const originalName = selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'gemini_cleaned';
    a.download = `${originalName}_no_watermark.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sample demo image generator for quick testing
  const loadSampleDemo = () => {
    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a beautiful AI cyberpunk gradient scene
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.5, '#312e81');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Draw some stylized geometry / moon
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(512, 450, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Gemini AI Generated Art (Demo)', 240, 750);

    // Draw realistic Gemini Sparkle watermark in bottom-right corner (size 96px, pad 32px)
    const starX = 1024 - 96 - 32 + 48;
    const starY = 1024 - 96 - 32 + 48;
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 12;

    // 4-pointed star
    ctx.beginPath();
    ctx.moveTo(starX, starY - 36);
    ctx.quadraticCurveTo(starX, starY, starX + 36, starY);
    ctx.quadraticCurveTo(starX, starY, starX, starY + 36);
    ctx.quadraticCurveTo(starX, starY, starX - 36, starY);
    ctx.quadraticCurveTo(starX, starY, starX, starY - 36);
    ctx.fill();
    ctx.restore();

    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'gemini_demo_sample.png', { type: 'image/png' });
        processImageFile(file);
      }
    });
  };

  return (
    <section id="tool" className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Glow highlight behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-10 backdrop-blur-xl">
        {!result ? (
          /* Upload State */
          <div>
            <div
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-violet-500 bg-violet-500/10 scale-[1.01]'
                  : 'border-slate-700/80 hover:border-violet-400/80 hover:bg-slate-800/40 bg-slate-950/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0])}
              />

              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  {isProcessing ? (
                    <RefreshCw className="w-7 h-7 text-violet-400 animate-spin" />
                  ) : (
                    <UploadCloud className="w-7 h-7 text-violet-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {isProcessing ? 'Removing Watermark Locally...' : 'Drop your Gemini image here, or browse'}
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Supports PNG, JPG, WebP. Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-xs">Cmd+V</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-xs">Ctrl+V</kbd> to paste directly from your clipboard!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Select Image
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSampleDemo();
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Try With Demo Sample
                </button>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free Forever &amp; No $1 Paywalls</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Zero Server Uploads (Client-Side HTML5)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mathematically Exact Reverse Alpha Restoration</span>
              </div>
            </div>
          </div>
        ) : (
          /* Processed Result State */
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Watermark Removed in {result.processingTimeMs}ms
                </span>
                <h3 className="text-lg font-bold text-white">
                  Original Resolution: {result.width} × {result.height}px (100% Lossless)
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Process Another
                </button>

                <button
                  type="button"
                  onClick={downloadCleanedImage}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Cleaned Image
                </button>
              </div>
            </div>

            {/* Interactive Before/After Split Slider */}
            <CompareSlider
              originalUrl={result.originalImageDataUrl}
              cleanedUrl={result.cleanedImageDataUrl}
            />

            <div className="mt-4 text-center text-xs text-slate-500">
              Drag the center slider left and right to inspect the pixel-level restoration.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
