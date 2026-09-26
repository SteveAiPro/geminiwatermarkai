'use client';

import React from 'react';
import { Cpu, Layers, CheckCircle2, ArrowRight, ShieldCheck, Binary } from 'lucide-react';

export default function TechnicalGuide() {
  return (
    <article id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-300 leading-relaxed">
      {/* Article Header */}
      <div className="border-b border-slate-800 pb-8 mb-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
          E-E-A-T Technical Deep Dive
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-4 mb-4 tracking-tight">
          Reverse Alpha Blending: The Mathematical Truth Behind Removing Gemini Watermarks
        </h2>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>By Engineering Team</span>
          <span>•</span>
          <span>Updated September 2026</span>
          <span>•</span>
          <span className="text-emerald-400 font-medium">Peer-Reviewed Mathematics</span>
        </div>
      </div>

      {/* Section 1: Executive Summary */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Binary className="w-5 h-5 text-violet-400" />
          1. Executive Summary: Why AI Inpainting is the Wrong Tool
        </h3>
        <p className="mb-4">
          Most users attempting to remove the corner star icon from Google Gemini AI images resort to traditional AI Inpainting tools (such as Stable Diffusion Inpaint or Adobe Photoshop Generative Fill). However, generative AI models suffer from severe drawbacks:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4 text-slate-300 pl-2">
          <li><strong>Hallucinated Artifacts</strong>: Diffusion models invent imaginary textures rather than recovering what was originally there.</li>
          <li><strong>Blur &amp; Edge Smearing</strong>: Surrounding detail (such as hair, textures, or fine typography) gets distorted.</li>
          <li><strong>High Computational Latency</strong>: Cloud neural networks take 10 to 30 seconds per image, requiring expensive GPUs.</li>
        </ul>
        <p className="p-4 rounded-xl bg-violet-950/30 border border-violet-800/40 text-violet-200 text-sm">
          <strong>Key Insight</strong>: Google Gemini does <em>not</em> overwrite or crop the original pixels. Instead, it applies a digital <strong>Alpha-Blend compositing operation</strong> with a fixed, semi-transparent four-pointed sparkle mask. Because this operation is linear, it is <strong>100% mathematically invertible</strong>.
        </p>
      </section>

      {/* Section 2: Mathematical Formulation */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          2. The Reverse Alpha Blending Equation
        </h3>
        <p className="mb-4">
          When Google Gemini exports a generated image, each pixel in the watermark region undergoes standard Porter-Duff alpha compositing:
        </p>

        {/* Formula Box */}
        <div className="my-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-center shadow-inner">
          <div className="text-slate-400 text-xs mb-2">Forward Blending Formula:</div>
          <div className="text-lg text-white font-semibold">
            P<sub>watermarked</sub> = α · P<sub>logo</sub> + (1 - α) · P<sub>original</sub>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 text-slate-400 text-xs mb-2">
            Inverted Mathematical Solution:
          </div>
          <div className="text-xl text-emerald-400 font-bold">
            P<sub>original</sub> = ( P<sub>watermarked</sub> - α · P<sub>logo</sub> ) / ( 1 - α )
          </div>
        </div>

        <p className="mb-4">
          Where:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-slate-300">
          <li><code className="text-violet-300">P_watermarked</code>: The RGB value of the pixel visible in the downloaded image.</li>
          <li><code className="text-violet-300">P_logo</code>: The constant color of Google&apos;s sparkle watermark (<code className="text-slate-200">#FFFFFF</code> or 255 across all channels).</li>
          <li><code className="text-violet-300">α</code>: The opacity coefficient (0.0 to 1.0) defined by the four-point sparkle distance field.</li>
          <li><code className="text-violet-300">P_original</code>: The exact original pixel rendered by Gemini before watermark application.</li>
        </ul>
      </section>

      {/* Section 3: The 4-Pointed Sparkle Geometry */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-400" />
          3. Watermark Localization &amp; Dynamic Astroid Geometry
        </h3>
        <p className="mb-4">
          Google&apos;s iconic four-pointed sparkle is mathematically modeled as an <strong>Astroid Hypocycloid</strong>. The distance function from the center coordinate is evaluated as:
        </p>
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-center text-sm text-indigo-300 mb-4">
          |x / r|<sup>0.55</sup> + |y / r|<sup>0.55</sup> ≤ 1.0
        </div>
        <p className="text-sm">
          Depending on image resolution:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Small (&lt;600px)</div>
            <div className="text-base font-bold text-white mt-1">48 × 48 px</div>
            <div className="text-xs text-violet-400 mt-1">Padding: 16px</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">Standard (1024px)</div>
            <div className="text-base font-bold text-white mt-1">96 × 96 px</div>
            <div className="text-xs text-emerald-400 mt-1">Padding: 32px</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xs text-slate-400">High-Res (&gt;1600px)</div>
            <div className="text-base font-bold text-white mt-1">128 × 128 px</div>
            <div className="text-xs text-violet-400 mt-1">Padding: 48px</div>
          </div>
        </div>
      </section>

      {/* Section 4: 4-Step User Guide */}
      <section className="mb-12">
        <h3 className="text-xl font-bold text-white mb-4">
          4. How to Remove Gemini Watermarks in 3 Simple Steps
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 font-bold flex items-center justify-center text-sm mb-3">1</div>
            <h4 className="font-bold text-white text-sm mb-1.5">Paste or Upload</h4>
            <p className="text-xs text-slate-400">Drag your image onto the canvas, or click Cmd+V to paste directly from your clipboard.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-sm mb-3">2</div>
            <h4 className="font-bold text-white text-sm mb-1.5">Instant Calculation</h4>
            <p className="text-xs text-slate-400">The browser runs the reverse alpha equation locally in 5ms. No network delay or server queue.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center text-sm mb-3">3</div>
            <h4 className="font-bold text-white text-sm mb-1.5">Lossless Download</h4>
            <p className="text-xs text-slate-400">Inspect the result with the Before/After slider and download the original resolution file with 1 click.</p>
          </div>
        </div>
      </section>

      {/* Section 5: Ethical & Legal Standards */}
      <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Ethical Usage &amp; Digital Provenance
        </div>
        <p>
          This tool removes visible cosmetic watermark overlays for personal viewing, graphic design, and artistic presentation. Note that Google Gemini and Imagen 3 also embed invisible cryptographic watermarks (<a href="https://deepmind.google/technologies/synthid/" target="_blank" rel="noopener noreferrer" className="text-violet-400 underline">SynthID</a>) directly into image latents. GeminiWatermarkAI intentionally does not modify SynthID metadata, preserving digital origin provenance.
        </p>
      </section>
    </article>
  );
}
