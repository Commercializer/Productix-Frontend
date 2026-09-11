import type { ReactNode } from "react";

/**
 * Triggers the Cal.com popup booking widget (initialized globally in the root
 * layout's cal-embed script) instead of navigating to a page. Used wherever a
 * marketing CTA's destination is conceptually "book a demo" - mirrors the
 * button markup already used in Header/Hero/FinalCta/StubPage.
 */
export function CalButton({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-cal-namespace="productix-discovery-call"
      data-cal-link="commercializer/productix-discovery-call"
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}
