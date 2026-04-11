import type { Metadata } from "next";

import { fontSans, fontMono } from "@/lib/fonts";
import { cn } from "@productix/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Productix — Visual Page Builder",
    template: "%s | Productix",
  },
  description:
    "Create beautiful, responsive pages in minutes with our drag-and-drop visual editor. No code required.",
  keywords: ["page builder", "visual editor", "drag and drop", "landing page"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          "font-sans antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
