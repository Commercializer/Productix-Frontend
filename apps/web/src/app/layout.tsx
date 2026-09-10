import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { MotionConfig } from "motion/react";
import Script from "next/script";

import { fontSans, fontMono } from "@/lib/fonts";
import { cn } from "@productix/utils";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { getGoogleFontsHref } from "@productix/editor";

import "./globals.css";

const SITE_URL = "https://www.productix.io";
const SITE_TITLE = "Productix | Connected Products, DPP, PPWR & GS1 Digital Link";
const SITE_DESCRIPTION =
  "Productix connects physical products with digital identity, DPP and PPWR data, GS1 Digital Link, connected experiences and actionable product intelligence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Productix",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "product experience infrastructure",
    "connected packaging",
    "FMCG",
    "consumer brands",
    "packaging analytics",
    "QR-enabled packaging",
    "consumer intelligence",
    "multilingual product delivery",
    "brand activation",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Productix", url: SITE_URL }],
  creator: "Productix",
  publisher: "Productix",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Productix",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-image.jpeg`, width: 1200, height: 633, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpeg`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1fb9b7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link href={getGoogleFontsHref()} rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          fontSans.variable,
          fontMono.variable,
          "font-sans antialiased"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </AuthProvider>
        </ThemeProvider>
        <Script id="cal-embed" strategy="afterInteractive">
          {`
            (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
            Cal("init", "productix-discovery-call", {origin:"https://app.cal.com"});
            Cal.ns["productix-discovery-call"]("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#00ccc6"},"dark":{"cal-brand":"#fafafa"}},"hideEventTypeDetails":false,"layout":"month_view"});
          `}
        </Script>
      </body>
      <GoogleAnalytics gaId="G-17LH6RDHYD" />
    </html>
  );
}
