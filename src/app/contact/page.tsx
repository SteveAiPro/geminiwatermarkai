import React from 'react';
import { Mail, MessageSquare, Github } from 'lucide-react';

export const metadata = {
  title: "Contact Us | GeminiWatermarkAI",
  description: "Get in touch with the GeminiWatermarkAI team for questions, bug reports, and feedback.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Mail className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Contact &amp; Support</h1>
          <p className="text-xs text-slate-400">We respond within 24–48 hours</p>
        </div>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border-t border-slate-800 pt-6">
        <p>
          Have questions, encountered a novel watermark variation, or want to contribute? Reach out through any of the channels below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <Mail className="w-4 h-4 text-violet-400" />
              Email Support
            </div>
            <p className="text-xs text-slate-400 mb-3">For general inquiries, bug reports, and partnership inquiries.</p>
            <a href="mailto:support@geminiwatermarkai.online" className="text-xs text-violet-300 hover:text-violet-200 font-mono underline">
              support@geminiwatermarkai.online
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white mb-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Community &amp; Feedback
            </div>
            <p className="text-xs text-slate-400 mb-3">Share image samples that didn&apos;t clear cleanly so we can refine the alpha map.</p>
            <span className="text-xs text-emerald-400 font-medium">Community feedback queue open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
