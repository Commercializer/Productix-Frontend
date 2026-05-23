/* ─────────────────────────────────────────────
 * Block Link Wrapper
 *
 * When an ElementNode has `link` set, this wraps
 * its rendered output in an <a> so clicking the
 * block navigates to that URL on the public /
 * preview page. Buttons are intentionally skipped
 * because they already render their own <a> via
 * their `url` prop — nesting <a> is invalid HTML.
 * ──────────────────────────────────────────── */

import React from "react";
import type { ElementNode } from "@productix/types";

/** Whether this element should be wrapped in an <a> tag for navigation. */
export function shouldWrapWithLink(el: ElementNode): boolean {
  if (!el.link || el.link.trim() === "") return false;
  // Buttons already render their own <a> via props.url — avoid nested anchors.
  if (el.type === "button") return false;
  return true;
}

interface BlockLinkProps {
  element: ElementNode;
  children: React.ReactNode;
}

/**
 * Wraps `children` in an <a> when the element has a link set.
 * Otherwise returns `children` untouched.
 */
export function BlockLink({ element, children }: BlockLinkProps) {
  if (!shouldWrapWithLink(element)) return <>{children}</>;

  const target = element.linkTarget || "_blank";
  const rel = target === "_blank" ? "noopener noreferrer" : undefined;

  return (
    <a
      href={element.link!}
      target={target}
      rel={rel}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        color: "inherit",
        textDecoration: "none",
        cursor: "pointer",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  );
}
