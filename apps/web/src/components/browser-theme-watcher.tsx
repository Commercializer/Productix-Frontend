"use client";

import { useEffect } from "react";

interface BrowserThemeWatcherProps {
  /** Hex / rgb / css color string for the browser chrome (address bar, status bar). */
  color: string;
}

/**
 * Keeps the <meta name="theme-color"> tag in sync with a given color.
 *
 * Mount inside a page where the browser chrome should match the page background.
 * Renders nothing.
 */
export function BrowserThemeWatcher({ color }: BrowserThemeWatcherProps) {
  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);
  }, [color]);

  return null;
}
