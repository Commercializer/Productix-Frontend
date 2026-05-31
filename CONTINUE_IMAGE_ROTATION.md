# Continuation: Image Rotation (Editor)

Handoff doc to resume this work in a new chat. Branch: `main`.

## Goal
Add image (element) rotation to the Productix editor, controllable both via the
properties panel **and** by dragging on the canvas (Figma/Canva-style corner rotate).

## Status: ✅ Implemented & running
- Typecheck passes (`cd packages/editor && npx tsc --noEmit`).
- Dev server verified serving `/editor` 200 with no `NaN`/render errors.
- Awaiting final human confirmation that the corner rotate cursor + drag feel right
  in the browser (do a hard-refresh ⌘⇧R after any restart).

## Key architectural fact
Rotation was **already wired end-to-end** before this work — `Transform.rotation`
exists and every render path applies `transform: rotate(${rotation}deg)`. Only the
UI to set it was missing. Relevant existing spots (do NOT need changes):
- Type: `packages/types/src/editor.ts` — `Transform.rotation`
- Edit mode: `packages/editor/src/engine/element-wrapper.tsx:178` (absolute branch)
- Published: `packages/editor/src/renderer/public-renderer.tsx:218`
- Preview: `packages/editor/src/renderer/preview-renderer.tsx`
- HTML export: `packages/editor/src/utils/export-html.ts` (~line 229)
- Store: `canvas-store.ts` `updateElementTransform(id, { rotation })`

## What was added this session
1. **Properties panel control** — `packages/editor/src/panels/properties-panel.tsx`
   - Added `updateElementTransform` store selector.
   - Rotation control in the "Appearance" section (after Opacity): range slider
     `-180..180` + editable, clamped number input. Writes `rotation` via
     `updateElementTransform`.
2. **Mouse rotation hook** — `packages/editor/src/interactions/use-rotate.ts` (NEW)
   - Mirrors `use-resize.ts`/`use-drag.ts` (pointer ref + rAF commit, `pushHistory()` on start).
   - Reads element on-screen center from `getBoundingClientRect()` (zoom/scale-agnostic;
     center is fixed during rotation). Sets `rotation` from pointer angle vs center.
   - Hold **Shift** = snap to 15°. No key needed to rotate.
3. **Corner rotate zones** — `packages/editor/src/engine/element-wrapper.tsx`
   - `ROTATE_ZONE_POSITIONS`: a 26px transparent hit-zone centered on each corner,
     `z-index 9998`; the 8px resize dot renders on top (`z-index 9999`).
   - Result: corner dot = resize; the ring just outside the corner = rotate.
   - Custom curved-arrow **rotate cursor** as an inline SVG data-URI.
   - The earlier top-center knob approach was removed in favor of this.
4. **Constants** — `packages/editor/src/interactions/constants.ts`
   - Added `ROTATION_ZONE_SIZE = 26` and `ROTATE_CURSOR` (encoded SVG cursor).
   - `ROTATION_HANDLE_OFFSET` (24) is now unused by the wrapper but left in place.

## Gotcha hit this session (important)
Adding **new exports** to `constants.ts` broke Turbopack fast-refresh: the importing
module re-ran against a stale snapshot where the new const was `undefined`, giving
`top: NaN` ("`NaN` is an invalid value for the `top` css style property") and
mispositioned/invisible rotate zones. **Fix = full dev-server restart + clear cache**,
then hard-refresh the browser. Not a source bug.

Restart recipe (user's `pnpm` is on Node 22.11 < required 22.13, so use the local next binary):
```bash
rm -rf apps/web/.next
cd apps/web && node node_modules/next/dist/bin/next dev --turbopack
```
The web app transpiles `@productix/editor` from source (`main: ./src/index.ts`,
in `transpilePackages`), so no editor build step is needed.

## Known limitations / possible follow-ups
- **Flow-mode elements** (those switched to flex `layout`) show no handles and don't
  rotate — rotation only applies in absolute mode. The flow branches in
  element-wrapper + both renderers + export-html + `computeElementLayoutCSS` would
  need rotation wiring to support that. (Default-placed images are absolute, so this
  is usually irrelevant.)
- Rotate zones/cursor apply to **all** element types in absolute mode, not just images
  (consistent with how resize handles + opacity control already work).
- If the SVG data-URI cursor ever fails to show, fall back to a visible knob +
  simpler cursor so the affordance is unambiguous.
- The resize handles aren't rotation-aware (dragging a rotated element still moves
  along screen axes) — acceptable, but a known rough edge.

## Files touched
- `packages/editor/src/panels/properties-panel.tsx`
- `packages/editor/src/interactions/use-rotate.ts` (new)
- `packages/editor/src/interactions/constants.ts`
- `packages/editor/src/engine/element-wrapper.tsx`

## Original feature backlog (this list is the broader roadmap)
- Image rotation ✅ (this doc)
- SEO content edit button (Editor & Product list) ✅ — Modal (`seo-settings-modal.tsx`)
  wrapping `seo-settings-panel.tsx` (title/tagline/description/OG image/favicon + live
  link preview). Opened from the dashboard product-list dropdown ("SEO & sharing") and the
  editor top-bar "SEO" pill (`onEditSeo` on `edit-renderer.tsx`). Backend: `getSeoFieldsAction`
  (lightweight fetch) + `updatePageMetaAction` now mirrors productName→canvas `pageTitle`.
  Both packages typecheck. Note: `onSaved` not wired, so a rename only shows after reload.
- Add Shapes ✅ — Canva-style. ONE unified `shape` element type (variant-driven) with a 16-shape
  library (rectangle, rounded, ellipse, triangle, right-triangle, diamond, pentagon, hexagon, star,
  heart, arrow, parallelogram, trapezoid, cross, semicircle, line). The blocks panel shows a single
  "Shape" block; clicking it opens a sub-popup picker (grid of live previews) overlaying the panel.
  Rect/ellipse/line render via CSS (crisp corners); other shapes via SVG with `preserveAspectRatio="none"`
  + `vector-effect="non-scaling-stroke"`. Property panel: fill, border color, border width, corner radius
  (rect only); line gets color/thickness/style. Files: `elements/shapes-catalog.tsx` (NEW — geometry +
  `ShapeRender`), `elements/shape-element.tsx` (NEW — registration), `elements/index.ts`,
  `elements/registry.ts` (added `"shape"` category), `panels/element-panel.tsx` (single block + `ShapePicker`),
  `utils/export-html.ts` (self-contained `shapeToHtml` + explicit height for `shape`). Typecheck passes.
- Add Carousel ✅ — Canva-style image carousel. ONE `carousel` element (category `media`) holding a
  `slides[]` array of `{ id, src, alt, caption }`. Autoplay (configurable interval), loop, prev/next
  arrows, dot navigation, pointer swipe, and slide/fade transitions. Live behavior vs. editor preview
  is gated by `isInsideEditor()` (`window.__productixEditor`, same pattern as the search element):
  autoplay + swipe are live-only; in the editor autoplay is paused but arrows/dots still change the
  previewed slide (clicks `stopPropagation` so they don't deselect/drag the block). Property panel: a
  compact horizontal thumbnail strip (one slide edited at a time, so the panel stays short no matter how
  many slides) — click a thumb to edit its `ImageUploadWidget` + caption, reorder (left/right) + remove,
  "+" tile to add; toggles for autoplay/loop/arrows/dots; interval, transition, image-fit, border radius,
  arrow & active-dot colors.
  Static HTML export = JS-free CSS scroll-snap carousel (swipeable; autoplay/arrows are renderer-only),
  with explicit height like `shape`. Files: `elements/carousel-element.tsx` (NEW), `elements/index.ts`,
  `panels/element-panel.tsx` (BLOCK_CONFIG + icon import), `utils/export-html.ts` (carousel case +
  needsExplicitHeight). Typecheck passes. ⚠️ Awaiting browser confirmation (hard-refresh after restart).
- Search bar modes (icon & search text) ✅ — Added a `mode` prop to the search element:
  `"icon"` (default — collapsed circular icon that expands on tap, original behavior) and
  `"bar"` (always-expanded search field filling the block width; no collapse/close, no
  auto-focus on load). On insert, the "Page Search" block now opens a small `SearchPicker`
  sub-popup (mirrors `ShapePicker`) offering the two styles with correct default transforms
  (icon 40×40, bar 320×44). The property panel has a segmented Mode toggle to switch after
  insert; "Expanded Width" only shows in icon mode. Bar-mode input lets pointer events reach
  the wrapper so the block stays draggable. Live/published search works via the registry
  component (public-renderer); static HTML export still shows the generic placeholder for
  `search` (pre-existing — neither mode is wired into export-html). Files: `elements/search-element.tsx`,
  `panels/element-panel.tsx`. Editor typecheck passes.
- Language model drag & drop positioning
- Version tracking & user edit log ✅ — Per-page version history + edit log. New Prisma model
  `ProductProfileVersion` (`product_profile_versions`: `profileId`, nullable `userId`, `content`
  JSON snapshot, `productName` label, `reason` save|publish|restore, `createdAt`) attached to
  `ProductProfile` (+ relation on `User`). Migration: hand-written `packages/db/prisma/migrations/
  add_product_profile_versions.sql` (repo convention — apply with Node ≥22.13: `pnpm db:push` or
  run the SQL). Capture is server-side in `apps/web/src/lib/dashboard/actions.ts`: a private
  `captureVersion()` helper appends a snapshot inside `savePageContentAction` (reason "save"),
  **deduped** vs the newest version (a single editor Save calls the action twice via onSave +
  onPublish) and pruned to the newest 50; `publishPageAction` promotes the latest snapshot's reason
  to "publish". New actions: `getPageVersionsAction` (list w/o content, joins user email),
  `getPageVersionContentAction`, `restorePageVersionAction` (copies content back + logs a "restore"
  snapshot, scoped `where:{id,profileId}` for tenant safety). UI: new
  `components/dashboard/version-history-modal.tsx` (mirrors `seo-settings-modal.tsx` shell; list with
  Saved/Published/Restored badges + relative time + editor email, inline-confirm Restore), opened
  from a new "Version history" item in the product-list dropdown (`promption-table.tsx`) **and** a
  "History" pill in the editor top bar (`onViewHistory` prop on `edit-renderer.tsx` → editor
  `page.tsx` renders the same modal; restoring from the editor reloads the page so the in-memory
  canvas reflects the rollback). Each entry shows a **detailed change summary** (e.g. "Renamed page
  to … · Added 2 images · Edited 3 elements (moved 1, content ×2)") computed server-side by
  `describeCanvasDiff()` in actions.ts at capture time (diffs elements by id: add/remove grouped by
  type, modified split into content/moved/resized/rotated/styled, page rename, section count) and
  stored in a new `summary` column (migration `add_product_profile_version_summary.sql`; restore rows
  read "Restored an earlier version"). **Dedicated detail page** at
  `(dashboard)/dashboard/history/[profileId]/page.tsx` — a full timeline where each entry expands the
  summary into a per-element breakdown (Added/Removed chips labelled by element text, Edited rows with
  content/moved/resized/rotated/styled tags, page rename, section changes) + restore. Powered by
  `getPageVersionDetailsAction` (loads each snapshot's content, recomputes a **structured** diff vs its
  predecessor via shared `diffCanvasDetailed()`; `summarizeChanges()` builds the one-liner — content is
  never sent to the client). Linked from the modal footer ("View full details") and reachable from the
  editor History button → modal → page. Both packages typecheck. ⚠️ Two schema changes total — apply
  with `pnpm db:push` (Node ≥22.13) + restart the dev server so the regenerated Prisma client loads.
  v1 still has no rendered per-version visual preview (links open the current live page).
- Average Visitor Duration ✅ — Implemented in commit 8e391cd (`page_views.duration_ms` +
  `/api/analytics/duration` beacon; migration `add_page_view_duration.sql`).
- PDF viewer element in editor blocks ✅ — New `pdf-viewer` element (category `media`) that
  embeds a PDF via the browser's built-in viewer (`<iframe>` + PDF Open Parameters:
  `#toolbar=`, `#page=`, `#view=FitH|Fit`). Same editor-overlay pattern as the video element
  (transparent `cursor:move` layer in-canvas so the block stays selectable/draggable; in the
  editor it also shows a filename chip). Property panel: a dedicated `PdfUploadWidget`
  (drag-drop / file-picker / URL paste, accept `application/pdf`, 25MB cap) plus open/download
  link, show-toolbar toggle, initial page, fit (width/page/default) and border radius.
  PDF upload required backend support — previously only images/audio were allowed:
  • `apps/web/src/lib/r2.ts` — added `ALLOWED_DOCUMENT_TYPES` (`application/pdf`),
    `MAX_DOCUMENT_SIZE` (25MB), `isAllowedDocument()`.
  • `apps/web/src/app/api/media/upload/route.ts` — accept documents, `documents/` R2 folder,
    `mediaType: "document"`.
  The `PdfUploadWidget` uploads via a direct `fetch("/api/media/upload")` (NOT through the
  IndexedDB media-store / image library, which is image/audio oriented), so the image library
  is untouched. Static HTML export renders the same `<iframe>` + explicit height (like shape/
  carousel via `needsExplicitHeight`). Files: `media/pdf-upload-widget.tsx` (NEW),
  `elements/pdf-viewer-element.tsx` (NEW), `elements/index.ts`, `panels/element-panel.tsx`
  (BLOCK_CONFIG + `FileText` import), `utils/export-html.ts`. Both packages typecheck.
  ⚠️ Awaiting browser confirmation (hard-refresh after restart).
