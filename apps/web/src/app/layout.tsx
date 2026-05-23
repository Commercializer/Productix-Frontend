import type { Metadata, Viewport } from "next";

import { fontSans, fontMono } from "@/lib/fonts";
import { cn } from "@productix/utils";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { getGoogleFontsHref } from "@productix/editor";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default:
      "Productix - Product Experience Infrastructure for Modern Consumer Brands",
    template: "%s | Productix",
  },
  description:
    "Productix transforms physical products into connected digital experiences through dynamic product engagement, consumer intelligence, packaging analytics, and activation infrastructure - built for FMCG and packaged-product brands at enterprise scale.",
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
