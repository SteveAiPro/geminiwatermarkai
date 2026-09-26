import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://geminiwatermarkai.online"),
  title: "Free Gemini Watermark Remover Online - 100% Client-Side, No Paywall | GeminiWatermarkAI",
  description: "Instantly remove visible watermarks and sparkle logos from Google Gemini AI images for free. 100% client-side in-browser processing, zero server upload, lossless quality, and no paywall.",
  keywords: [
    "gemini watermark remover",
    "remove gemini watermark",
    "gemini watermark remover online",
    "gemini logo remover",
    "free gemini watermark remover",
    "google flow watermark remover",
    "reverse alpha blending gemini",
    "gemini watermark cleaner"
  ],
  alternates: {
    canonical: "https://geminiwatermarkai.online",
  },
  openGraph: {
    title: "Free Gemini Watermark Remover Online - Lossless & 100% Free",
    description: "Remove Google Gemini sparkle watermarks instantly in your browser. No server uploads, no sign-up, zero paywall.",
    url: "https://geminiwatermarkai.online",
    siteName: "GeminiWatermarkAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gemini Watermark Remover Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Gemini Watermark Remover Online - 100% Client-Side, No Paywall",
    description: "Lossless in-browser reverse alpha blending to erase Gemini watermarks without hallucinations or subscriptions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GeminiWatermarkAI",
    "operatingSystem": "All modern browsers (Chrome, Edge, Safari, Firefox)",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "A high-performance client-side tool to remove visible sparkle watermarks from Google Gemini AI images using mathematical Reverse Alpha Blending.",
    "url": "https://geminiwatermarkai.online",
    "author": {
      "@type": "Organization",
      "name": "GeminiWatermarkAI Team"
    }
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaApp) }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-violet-500 selection:text-white`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
