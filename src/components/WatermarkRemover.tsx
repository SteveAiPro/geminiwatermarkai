'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Download,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
  Sliders,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';
import CompareSlider from './CompareSlider';
import {
  removeGeminiWatermark,
  ProcessResult,
  WatermarkSettings,
  getWatermarkInfo
} from '@/lib/watermarkEngine';

export default function WatermarkRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageElement, setCurrentImageElement] = useState<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tuner state
  const [showTuner, setShowTuner] = useState(false);
  const [tunerSettings, setTunerSettings] = useState<WatermarkSettings>({
    offsetX: 0,
    offsetY: 0,
    sizeScale: 1.0,
    gain: 0.6,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processLoadedImage = useCallback(async (
    img: HTMLImageElement,
    customSettings?: Partial<WatermarkSettings>
  ) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await removeGeminiWatermark(img, customSettings);
      setResult(res);
      setTunerSettings(res.currentSettings);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to process watermark.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

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
          setCurrentImageElement(img);
          await processLoadedImage(img);
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

  // Live Reprocess on Tuner Change
  const handleSettingChange = (key: keyof WatermarkSettings, value: number) => {
    const updated = { ...tunerSettings, [key]: value };
    setTunerSettings(updated);
    if (currentImageElement) {
      processLoadedImage(currentImageElement, updated);
    }
  };

  const applyPreset = (presetType: 'new' | 'classic' | 'fixed_inset' | 'fixed_corner') => {
    if (!currentImageElement) return;
    const w = currentImageElement.naturalWidth || currentImageElement.width;
    const h = currentImageElement.naturalHeight || currentImageElement.height;
    const minDim = Math.min(w, h);
    const baseRatio = minDim / 1536;
    const base = getWatermarkInfo(w, h);

    let newSettings: WatermarkSettings;

    if (presetType === 'new') {
      const m = Math.max(8, Math.round(192 * baseRatio));
      newSettings = {
        offsetX: (w - m - base.size) - base.x,
        offsetY: (h - m - base.size) - base.y,
        sizeScale: 1.0,
        gain: 0.6,
      };
    } else if (presetType === 'classic') {
      const m = Math.max(8, Math.round(64 * baseRatio));
      newSettings = {
        offsetX: (w - m - base.size) - base.x,
        offsetY: (h - m - base.size) - base.y,
        sizeScale: 1.0,
        gain: 1.0,
      };
    } else if (presetType === 'fixed_inset') {
      const m = minDim >= 1400 ? 192 : Math.round(128 * Math.max(0.5, minDim / 1024));
      newSettings = {
        offsetX: (w - m - 96) - base.x,
        offsetY: (h - m - 96) - base.y,
        sizeScale: Math.round((96 / base.size) * 100) / 100,
        gain: 0.6,
      };
    } else {
      const m = minDim >= 1024 ? 64 : 32;
      newSettings = {
        offsetX: (w - m - 96) - base.x,
        offsetY: (h - m - 96) - base.y,
        sizeScale: Math.round((96 / base.size) * 100) / 100,
        gain: 1.0,
      };
    }

    setTunerSettings(newSettings);
    processLoadedImage(currentImageElement, newSettings);
  };

  const resetToAutoDetected = () => {
    if (!result || !currentImageElement) return;
    const autoSettings: WatermarkSettings = {
      offsetX: result.detected.offsetX,
      offsetY: result.detected.offsetY,
      sizeScale: result.detected.sizeScale,
      gain: result.detected.gain,
    };
    setTunerSettings(autoSettings);
    processLoadedImage(currentImageElement, autoSettings);
  };

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
    setCurrentImageElement(null);
    setResult(null);
    setErrorMessage(null);
    setShowTuner(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sample demo image loader using real Gemini test images
  const loadRealGeminiSample = async (samplePath: string, sampleName: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: 'image/png' });
      processImageFile(file);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Could not load sample image.');
      setIsProcessing(false);
    }
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
                {isProcessing ? 'Detecting & Removing Watermark...' : 'Drop your Gemini image here, or browse'}
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
                    loadRealGeminiSample('/assets/test_img1.png', 'gemini_sample_portrait.png');
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Try Real Sample 1
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadRealGeminiSample('/assets/test_img2.png', 'gemini_sample_render.png');
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Try Real Sample 2
                </button>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
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
                <span>Zero Server Uploads (Client-Side HTML5 Canvas)</span>
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
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Watermark Removed in {result.processingTimeMs}ms
                  </span>

                  {result.detected.matchFound ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 border border-violet-500/30 text-violet-300">
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      Auto-Detected: {result.detected.name} ({Math.round(result.detected.score * 100)}% match)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                      Applied Standard Preset ({result.detected.name})
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  Resolution: {result.width} × {result.height}px (100% Lossless)
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowTuner(!showTuner)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                    showTuner
                      ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/25'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {showTuner ? 'Hide Fine-Tune' : 'Fine-Tune Position'}
                </button>

                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Upload Another
                </button>

                <button
                  type="button"
                  onClick={downloadCleanedImage}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
              </div>
            </div>

            {/* Fine-Tuner Drawer */}
            {showTuner && (
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 transition-all">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <Sliders className="w-4 h-4 text-violet-400" />
                    Watermark Position &amp; Scale Fine-Tuner
                  </div>
                  <button
                    type="button"
                    onClick={resetToAutoDetected}
                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Auto
                  </button>
                </div>

                {/* Preset Fast Switch */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-400 mb-2">
                    Quick Preset Select:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset('new')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
                    >
                      Gemini Adaptive Inset (12.5%)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('classic')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
                    >
                      Classic Corner (4.16%)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('fixed_inset')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
                    >
                      Fixed 96px Inset
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('fixed_corner')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
                    >
                      Fixed 96px Corner
                    </button>
                  </div>
                </div>

                {/* 4 Interactive Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Offset X */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Horizontal (X):</span>
                      <span className="font-mono text-violet-400">{tunerSettings.offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min={-160}
                      max={160}
                      step={2}
                      value={tunerSettings.offsetX}
                      onChange={(e) => handleSettingChange('offsetX', parseInt(e.target.value, 10))}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  {/* Offset Y */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Vertical (Y):</span>
                      <span className="font-mono text-violet-400">{tunerSettings.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min={-160}
                      max={160}
                      step={2}
                      value={tunerSettings.offsetY}
                      onChange={(e) => handleSettingChange('offsetY', parseInt(e.target.value, 10))}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  {/* Size Scale */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Size Scale:</span>
                      <span className="font-mono text-violet-400">{tunerSettings.sizeScale}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.4}
                      max={2.2}
                      step={0.05}
                      value={tunerSettings.sizeScale}
                      onChange={(e) => handleSettingChange('sizeScale', parseFloat(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>

                  {/* Alpha Gain / Strength */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Strength (Gain):</span>
                      <span className="font-mono text-violet-400">{tunerSettings.gain}</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={1.5}
                      step={0.05}
                      value={tunerSettings.gain}
                      onChange={(e) => handleSettingChange('gain', parseFloat(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Before/After Split Slider */}
            <CompareSlider
              originalUrl={result.originalImageDataUrl}
              cleanedUrl={result.cleanedImageDataUrl}
            />

            <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400">
              <span>Drag the center line left/right to inspect the restoration.</span>
              <span className="text-slate-500">
                Watermark box at: ({result.watermarkBox.x}, {result.watermarkBox.y}) · Size:{' '}
                {result.watermarkBox.width}px
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
