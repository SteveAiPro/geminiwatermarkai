import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy | GeminiWatermarkAI",
  description: "Our privacy policy: 100% client-side processing, zero server uploads, and no data tracking.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last Updated: September 2026</p>
        </div>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border-t border-slate-800 pt-6">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Core Privacy Principle: Zero Server Uploads</h2>
          <p>
            GeminiWatermarkAI operates entirely as a <strong>client-side web application</strong>. When you select, drag-and-drop, or paste an image, the image file is read directly into your device&apos;s local browser memory via the HTML5 File API and Canvas API.
          </p>
          <p className="mt-2 text-emerald-400 font-medium">
            Your images and videos are NEVER transmitted, uploaded, or stored on our servers, third-party databases, or cloud providers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. No Personal Data Collection</h2>
          <p>
            We do not require account registration, email submission, or payment details. We do not track personal identifying information (PII).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. Analytics &amp; Cookies</h2>
          <p>
            We may use privacy-first, aggregated performance analytics (e.g., Cloudflare Web Analytics) to monitor website uptime, geographic speed, and Core Web Vitals without storing identifying cookies or tracking users across the internet.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Contact Regarding Privacy</h2>
          <p>
            If you have questions about our zero-upload architecture, please contact us at <a href="mailto:support@geminiwatermarkai.online" className="text-violet-400 underline">support@geminiwatermarkai.online</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
