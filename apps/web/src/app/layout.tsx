import type { Metadata } from "next";

import { fontSans, fontMono } from "@/lib/fonts";
import { cn } from "@productix/utils";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { getGoogleFontsHref } from "@productix/editor";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link href={getGoogleFontsHref()} rel="stylesheet" />
      </head>
      <body
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
