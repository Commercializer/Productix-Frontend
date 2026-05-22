"use client";

import React, { createContext, useContext } from "react";

export interface PublicPageContextValue {
  productId?: string;
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
