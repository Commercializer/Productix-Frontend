"use client";

import React, { createContext, useContext } from "react";

export interface PublicPageContextValue {
  productId?: string;
  /**
   * Short per-company branch code this page was opened for, taken from the
   * QR/share URL (`?b=<code>`). When set, the feedback form attributes every
   * submission to this branch and hides the branch picker — the QR already
   * determined the location. Resolved to a real branch server-side on submit.
   */
  forcedBranchCode?: string;
  /**
   * Optional element to portal overlays (feedback sheet, etc.) into.
   * When set, overlays render with `position: absolute` inside this
   * element instead of `position: fixed` on the document body - letting
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
