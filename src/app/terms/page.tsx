import React from 'react';
import { FileText } from 'lucide-react';

export const metadata = {
  title: "Terms of Service | GeminiWatermarkAI",
  description: "Terms of service and fair use guidelines for GeminiWatermarkAI.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400">Effective Date: September 2026</p>
        </div>
      </div>

      <div className="space-y-6 text-sm leading-relaxed border-t border-slate-800 pt-6">
        <section>
          <h2 className="text-base font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using GeminiWatermarkAI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">2. Permitted Use &amp; Intellectual Property</h2>
          <p>
            The Service provides a mathematical tool for removing cosmetic overlay marks from digital images created by you or for which you have explicit rights of modification.
          </p>
          <p className="mt-2 text-slate-400">
            You agree not to use this tool to infringe on the copyrights, trademarks, or proprietary rights of third parties or to misrepresent AI-generated material where disclosure is legally required.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">3. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; basis without warranties of any kind, whether express or implied. GeminiWatermarkAI does not warrant that the Service will meet your requirements or be error-free.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white mb-2">4. Trademark Disclaimer</h2>
          <p>
            Google, Gemini, and Imagen are trademarks of Google LLC. GeminiWatermarkAI is an independent open-source utility and is not affiliated with, endorsed by, or sponsored by Google LLC.
          </p>
        </section>
      </div>
    </div>
  );
}
