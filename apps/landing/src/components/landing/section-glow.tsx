/**
 * Soft ambient color wash behind a section, so glass cards/panels have
 * something colorful to refract instead of sitting on flat white. Reuses
 * the float/glow keyframes already defined in globals.css for the hero.
 */
export function SectionGlow({
  strong = false,
  flip = false,
}: {
  strong?: boolean;
  flip?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`anim-float absolute -top-24 h-72 w-72 rounded-full blur-3xl ${
          flip ? "right-[6%]" : "left-[6%]"
        } ${strong ? "bg-teal/25" : "bg-teal/14"}`}
      />
      <div
        className={`anim-glow absolute -bottom-24 h-80 w-80 rounded-full blur-3xl ${
          flip ? "left-[8%]" : "right-[8%]"
        } ${strong ? "bg-sky/20" : "bg-sky/12"}`}
      />
    </div>
  );
}
