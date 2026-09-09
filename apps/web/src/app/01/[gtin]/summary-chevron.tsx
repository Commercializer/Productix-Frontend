// Right-side disclosure arrow and regulation-citation icon for every
// collapsible section's <summary> (SectionCard, PackagingLayersView,
// RepeatableRowsView). Pure CSS/HTML - the chevron rotation is a
// `details[open] > summary .dpp-chevron` rule, and the info icon's tooltip
// is a native `title` attribute - so no client JS is needed for either.
import { Info } from "lucide-react";

export function SectionChevronStyle() {
  return (
    <style>{`
      details[open] > summary .dpp-chevron { transform: rotate(90deg); }
      summary.dpp-summary::-webkit-details-marker { display: none; }
    `}</style>
  );
}

export function SectionChevron() {
  return (
    <svg
      className="dpp-chevron"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "#94a3b8", flexShrink: 0, transition: "transform 0.2s ease" }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/** Regulation citation for a section (e.g. "EU Regulation 2024/1781 (ESPR) ·
 * Art. 7(2)(a)"), shown as a small hoverable icon next to the section title
 * instead of printed as a line of small print at the bottom of the card. */
export function SectionInfoIcon({ directive }: { directive?: string }) {
  if (!directive) return null;
  return (
    <span title={directive} aria-label={directive} style={{ display: "inline-flex", flexShrink: 0, color: "#94a3b8", cursor: "help" }}>
      <Info size={15} />
    </span>
  );
}
