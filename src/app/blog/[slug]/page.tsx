import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
  BlogPost
} from '@/lib/blogData';
import {
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Share2,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import AdsterraLeaderboard from '@/components/ads/AdsterraLeaderboard';
import AdsterraNative from '@/components/ads/AdsterraNative';
import AdsterraRectangle from '@/components/ads/AdsterraRectangle';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};

  const url = `https://geminiwatermarkai.online/blog/${post.slug}`;

  return {
    title: `${post.title} | GeminiWatermarkAI Blog`,
    description: post.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: url,
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  // Schema.org Article & FAQPage JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.metaDescription,
    'datePublished': post.publishDate,
    'author': {
      '@type': 'Organization',
      'name': post.author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'GeminiWatermarkAI',
      'url': 'https://geminiwatermarkai.online',
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://geminiwatermarkai.online/blog/${post.slug}`,
    },
  };

  const faqSchema = post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': post.faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a,
      },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://geminiwatermarkai.online',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': 'https://geminiwatermarkai.online/blog',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `https://geminiwatermarkai.online/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-violet-600/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <Link href="/blog" className="hover:text-violet-400 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-slate-200 truncate">{post.title}</span>
        </nav>

        {/* Header section */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-semibold">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishDate}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* E-E-A-T Key Takeaways Box */}
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-violet-950/40 to-slate-900 border border-violet-800/40 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-violet-300 uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Key Takeaways (核心要点)</span>
          </div>
          <ul className="space-y-3">
            {post.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-200 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Adsterra Top Leaderboard */}
        <AdsterraLeaderboard />

        {/* Article Body Content */}
        <div className="prose prose-invert prose-violet max-w-none my-8 leading-relaxed space-y-6 text-slate-300">
          <div
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-white mt-8 mb-4 tracking-tight">$1</h2>')
                .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-violet-300 mt-6 mb-3">$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-violet-400 hover:text-violet-300 underline underline-offset-4 font-semibold">$1</a>'),
            }}
          />
        </div>

        {/* Step by step card showcase (if present) */}
        {post.steps && post.steps.length > 0 && (
          <div className="my-10">
            <h2 className="text-2xl font-bold text-white mb-6">
              Step-by-Step Action Plan
            </h2>
            <div className="space-y-4">
              {post.steps.map((s, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-all flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">{s.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Native Ad Unit */}
        <AdsterraNative />

        {/* FAQ Section */}
        {post.faqs.length > 0 && (
          <section className="my-10 pt-8 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-violet-400" />
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <div className="my-12 p-8 rounded-3xl bg-gradient-to-r from-violet-950/60 to-slate-900 border border-violet-800/50 text-center shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl font-bold text-white mb-2">
            Try the Free Gemini Watermark Remover
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
            100% in-browser reverse alpha blending. Lossless original resolution, no server uploads.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Clean Your Image Now</span>
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-sm">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to all guides
          </Link>
          <Link href="/" className="text-slate-400 hover:text-slate-200">
            Back to Home
          </Link>
        </div>
      </article>
    </>
  );
}
