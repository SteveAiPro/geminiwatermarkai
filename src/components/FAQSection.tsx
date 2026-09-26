'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Is this tool really 100% free with no paywall or trial period?",
    answer: "Yes, absolutely. Unlike services like geminiwatermark.io that bait users with 'free' and then require a $1 trial or $7/month subscription, GeminiWatermarkAI is permanently free. The computation runs entirely on your local machine using standard HTML5 Canvas, which costs us zero server fees."
  },
  {
    question: "Are my images uploaded to any server or cloud database?",
    answer: "No. Your images never leave your browser. All pixel transformations and reverse alpha blending calculations take place locally inside your browser's memory using JavaScript and HTML5 Canvas. Your privacy is 100% protected."
  },
  {
    question: "How does this compare to AI inpainting (e.g. Photoshop or Stable Diffusion)?",
    answer: "AI inpainting attempts to 'guess' and re-draw what lies under the watermark, frequently causing blurry patches and hallucinations. Our tool uses mathematically exact Reverse Alpha Blending to algebraically invert Google's linear transparency equation, restoring the original pixel values without blur or distortion."
  },
  {
    question: "Does this remove watermarks from Google Flow and Veo videos as well?",
    answer: "For videos, each frame contains the same sparkle overlay. You can extract individual frames to clean them with this tool, or use our upcoming video canvas extractor."
  },
  {
    question: "What image formats and resolutions are supported?",
    answer: "We support all standard web formats including PNG, JPEG, and WebP up to 4K+ resolutions. Because computation runs on your device, processing speeds remain fast regardless of file size."
  },
  {
    question: "Does this remove Google's invisible SynthID watermark?",
    answer: "No. This tool only removes the visible cosmetic sparkle icon in the corner. SynthID is an invisible, cryptographic watermark embedded in the image latents for digital provenance."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
          Frequently Asked Questions
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 mb-4 tracking-tight">
          Everything You Need to Know About Gemini Watermark Removal
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Got questions? We have answers. If you need further help, feel free to reach out.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-violet-300 transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-violet-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQPage Schema JSON-LD for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map((f) => ({
              "@type": "Question",
              "name": f.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.answer
              }
            }))
          })
        }}
      />
    </section>
  );
}
