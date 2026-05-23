"use client";

import React, { createContext, useContext } from "react";

export interface PublicPageContextValue {
  productId?: string;
  /**
   * Optional element to portal overlays (feedback sheet, etc.) into.
   * When set, overlays render with `position: absolute` inside this
   * element instead of `position: fixed` on the document body — letting
   * them behave like a real mobile simulator inside a phone mockup.
   * The element should be `position: relative` (or similar).
   */
  portalRoot?: HTMLElement | null;
}

const PublicPageContext = createContext<PublicPageContextValue>({});

export function PublicPageProvider({
  value,
  children,
}: {
  value: PublicPageContextValue;
  children: React.ReactNode;
}) {
  return <PublicPageContext.Provider value={value}>{children}</PublicPageContext.Provider>;
}

export function usePublicPage(): PublicPageContextValue {
  return useContext(PublicPageContext);
}
