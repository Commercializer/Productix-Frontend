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
  /** The product's GS1 barcode number, if it has one. Powers the GTIN verification badge element. */
  gtin?: string | null;
  /** e.g. "GS1_VERIFIED" | "GS1_NOT_FOUND" | "VALID_FORMAT" | "UNVERIFIED" | "INVALID_FORMAT" - see Gs1VerificationStatus in packages/db/prisma/schema.prisma. */
  gtinStatus?: string | null;
  gtinVerifiedAt?: string | null;
  /** Raw GS1 GTIN Check API response fields (GCPOwner, GS1Territory, BrandName, ...) captured at verification time. */
  gtinData?: Record<string, unknown> | null;
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
