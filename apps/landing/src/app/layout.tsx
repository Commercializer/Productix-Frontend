import type { Metadata } from "next";

import { fontMono } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "Productix | Product Experience Infrastructure",
  description:
    "Productix powers connected packaging, consumer intelligence, and product engagement infrastructure for enterprise consumer brands.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontMono.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
