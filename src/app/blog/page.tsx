import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blogData';
import { BookOpen, Sparkles, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import AdsterraLeaderboard from '@/components/ads/AdsterraLeaderboard';
import AdsterraNative from '@/components/ads/AdsterraNative';

export const metadata: Metadata = {
  title: 'Gemini Watermark Removal Blog & Technical Guides | GeminiWatermarkAI',
  description: 'Expert guides, tutorials, and algorithmic deep dives on Google Gemini AI watermark removal, Reverse Alpha Blending, and Imagen 3 photorealism restoration.',
  alternates: {
    canonical: 'https://geminiwatermarkai.online/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-violet-600/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-950/60 border border-violet-800/60 text-violet-300 mb-4 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-violet-400" />
          <span>Knowledge Base &amp; Engineering Lab</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Gemini AI Watermark <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">Research &amp; Guides</span>
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Deep dives into computer vision, mathematical alpha unblending, Google Imagen 3 watermark profiles, and lossless image restoration.
        </p>
      </div>

      {/* Top Banner Ad */}
      <AdsterraLeaderboard />

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
        {BLOG_POSTS.map((post, idx) => (
          <article
            key={post.slug}
            className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-violet-500/50 p-6 flex flex-col justify-between transition-all hover:bg-slate-900/90 hover:shadow-xl hover:shadow-violet-600/10"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors mb-3 leading-snug">
                <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {post.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">{post.publishDate}</span>
              <span className="text-violet-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Native Ad Stream */}
      <AdsterraNative />

      {/* CTA Card back to main tool */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-violet-950/60 via-indigo-950/40 to-slate-900 border border-violet-800/50 text-center relative overflow-hidden shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-2">
          Want to Remove Gemini Watermarks Right Now?
        </h3>
        <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6">
          Experience mathematical reverse alpha blending in your browser. No sign-up, zero server uploads, 100% free.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Watermark Remover</span>
        </Link>
      </div>
    </div>
  );
}
