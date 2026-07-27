# GS1 Digital Link Alignment — Roadmap & Handoff

## TL;DR — current state

**Phase 1 is done and builds clean** (`pnpm --filter @productix/web type-check` and `build` both pass). What's live:

- Products can have a GTIN (8/12/13/14-digit), validated locally with the real GS1 mod-10 check
  digit — works with zero configuration.
- **Live integration with the real GS1 UK GTIN Check API** (`https://gtincheck.gs1uk.org`) —
  implemented 2026-07-27 from the official Developers' Guide v5.0, replacing the earlier
  placeholder/stubbed client. See [The GS1 GTIN Check API integration](#the-gs1-gtin-check-api-integration).
- Two QR formats: **General QR** (today's `/p/<shortCode>` etc., completely unchanged) and
  **GS1 Digital Link QR** (`/01/{gtin}`, spec-compliant), selectable per-product in the QR modal.
- A company Settings toggle — "Require a valid GTIN before publishing" — that blocks product
  creation, publishing, and QR issuance when unset.
- A dedicated **GTIN column** in the products table (right after Name), showing "GTIN Verified" /
  "Valid Format" / "Not in Registry", or an **"Add GTIN"** action for products that don't have one
  yet — added 2026-07-26, see [Adding a GTIN to an existing product](#adding-a-gtin-to-an-existing-product).
- Clicking any GTIN status badge opens a **read-only details view** — GTIN, status, checked-at
  timestamp, and whatever fields the GS1 API returned (brand, product description, net content,
  country of sale, GPC category, GCP owner/territory, product image), persisted in
  `Product.gtinData` at verification time — added 2026-07-27, see
  [Viewing GTIN details](#viewing-gtin-details).

**Not built yet** (see phase write-ups below, each has enough detail to resume cold):
- The visual-editor "Authentication" element (popup badge + inline widget).
- An "authenticity click" analytics metric.
- Productix Connect vs Enterprise plan-gating / modularization.

---

## Original roadmap (verbatim, as given)

> Productix Updates
>
> Main Task - Aligning with GS1 Digital Link Ready
>
> Integrate with GS1 - GTIN Check API
>
> Add Product -> Scan or Enter GTIN -> Validate GTIN & show GS1 data by side (Add the
> authentication vibe which make the trust) Show Verified by GS1 standards with GS1 logo in
> small.
>
> Show GS1 verified status in product list
>
> Rearrange QR code upto GS1 Digital Link Standard
>
> Rearrange channel traffic identifier to GS1 Digital Link Standard
>
> Will make two QR types (GS1 Digital Link QR | General QR)
>
> In Settings, Let restrict QR / Product GTIN validation (If GTIN restricted, can't proceed
> without valid GTIN)
>
> --------------
>
> Add Authentication Element to the visual editor in two formats ( Pop up button & embedded
> widget on screen)
>
> This element should show product authenticity to customer once clicked, show GS1 verified
> product and add link to GS1 verification website for further data on authority.
>
> ---------
>
> Show authority clicks count on analytics
>
> --------
>
> Make the Productix platform modularized, we need to introduce plans,
>
> Productix Connect - > Basic GS1 QR + Visual Builder, Feedbacks + Basic Analytics on scans
> count
>
> Productix Enterprise - All features for now
>
> -------------
>
> bu we need to keep current barcode too, with same current one and GS1 QR both should work

---

## Phase 1 — scope & status

Everything below is **done**.

| Item | Where |
|---|---|
| `Product.gtin` / `gtinStatus` / `gtinVerifiedAt` / `gtinData`, `Company.requireValidGtin`, `Gs1VerificationStatus` enum, `QrScanType.GS1` | `packages/db/prisma/schema.prisma` |
| Hand-saved SQL migrations | `packages/db/prisma/migrations/add_qr_scan_type_gs1.sql`, `add_product_gtin.sql`, `add_company_require_valid_gtin.sql`, `add_product_gtin_data.sql` |
| GS1 check-digit validation (real, local, no API needed) | `apps/web/src/lib/gs1/check-digit.ts` |
| Live GS1 UK GTIN Check API integration | `apps/web/src/lib/gs1/client.ts` |
| Shared "only show available fields" formatting (`humanizeGtinKey`, `formatGtinValue`, `availableGtinDetailEntries`) | `apps/web/src/lib/gs1/format.ts` |
| GS1 Digital Link URL builder + path-segment parser | `apps/web/src/lib/gs1/digital-link.ts` |
| `checkGtinAction`, `verifyGtinAction`, GTIN enforcement in `createPromptionAction` / `publishPageAction`, `getPublicPageByGtinAction`, `updateGtinPolicyAction` | `apps/web/src/lib/dashboard/actions.ts` |
| Shared resolve/render helpers (`buildPublicMetadataFromPage`, `renderResolvedPage`) — pure refactor, `/p`, `/l`, `/s`, `/[prefix]` all unaffected | `apps/web/src/app/p/[slug]/page.tsx` |
| GS1 Digital Link resolver route | `apps/web/src/app/01/[gtin]/page.tsx` |
| Add-Product GTIN field + live validation UI | `apps/web/src/app/(dashboard)/dashboard/new/page.tsx` |
| QR modal: General vs GS1 Digital Link format toggle | `apps/web/src/components/dashboard/qr-modal.tsx` |
| Product list GTIN column (badge + "Add GTIN" for products without one) | `apps/web/src/components/dashboard/promption-table.tsx`, `apps/web/src/hooks/use-promptions.ts` |
| Settings toggle card | `apps/web/src/components/dashboard/gtin-policy-card.tsx`, wired into `apps/web/src/app/(dashboard)/dashboard/settings/page.tsx`, `apps/web/src/hooks/use-settings.ts` |
| Add GTIN to an existing product (null → set only) | `updateProductGtinAction` in `apps/web/src/lib/dashboard/actions.ts`; `ProductGtinEditModal` in `apps/web/src/components/dashboard/promption-table.tsx` |
| Re-check a stale GTIN verification (status/data only, GTIN itself stays immutable) | `refreshGtinVerificationAction` in `apps/web/src/lib/dashboard/actions.ts`; "Re-check with GS1" button in `GtinDetailsModal` |

### Key decisions made along the way

- **GTIN lives on `Product`**, not `ProductProfile` (it identifies the physical item; a product's
  language profiles share one GTIN — same reasoning as `shortCode`/`categoryId`).
- **GTIN can be *added* to an existing product that doesn't have one yet, but never *changed* once
  set.** `updateProductGtinAction` (added 2026-07-26) only allows the null → set transition — it
  400s if the product already has a `gtin`. This still avoids the original "already-printed QR
  points at the wrong GTIN" risk (that risk only exists once a GTIN — and thus a GS1 QR — already
  exists), while closing the "I forgot to add one at creation" gap. If you need to *correct* an
  already-set GTIN later, that's a separate, more sensitive action worth admin-gating (it could
  invalidate already-printed GS1 QR codes).
- **No literal GS1 logo asset is used anywhere.** The GS1 mark is a trademark that typically
  requires certification/licensing to display. The UI uses a generic `BadgeCheck` icon + the text
  "GTIN Verified" instead. Swap in a licensed logo asset if/when you have one — search the
  codebase for `BadgeCheck` to find every spot.
- **"GTIN Verified" only ever appears when the external API confirms a full, active product match**
  (`gtinStatus === "GS1_VERIFIED"`, i.e. `CertaintyValue === 3 && Status === "ACTIVE"` - see
  [The GS1 GTIN Check API integration](#the-gs1-gtin-check-api-integration)). Check-digit-only
  validation is labeled "Valid GTIN format" — a different, honest claim. `GS1_NOT_FOUND` (locally
  valid, but not a confirmed active match) is still treated as satisfying the `requireValidGtin`
  policy — it doesn't block publishing, it just doesn't get the green badge.
- **GS1 Digital Link QR uses the app's own domain by default** (`https://{app}/01/{gtin}`). If a
  company has `customDomain` set, the QR modal will build the URL against it, but **there is no
  working custom-domain hosting anywhere in this repo** (only a cosmetic preview page exists) —
  this is an infra gap, not something Phase 1 solved.
- **Channel/branch attribution moved into the query string** (`?ch=` for channel, reusing the
  existing `?b=` for branch) instead of a path prefix, because the GS1 Digital Link Standard
  reserves path segments strictly for identifiers/qualifiers (§5.8) — this was a spec requirement,
  not a style choice.
- **Manual GTIN entry only.** Camera/barcode scanning was scoped out — no scanning library exists
  in the repo. If you want it: the `BarcodeDetector` browser API (Chrome/Edge/Android, no new
  dependency) with a manual-entry fallback (Safari/iOS support is inconsistent) is the cheapest
  path; `@zxing/browser` is the fallback if you need guaranteed cross-browser support.

---

## Environment notes

- Node **≥22.13** required for `pnpm` in this repo (an older local Node will error at the pnpm
  version-check step, not partway through). If you don't have it: `nvm install 22.13.1 && nvm use
  22.13.1`.
- Schema changes are applied with **`pnpm --filter @productix/db db:push`** (not `prisma migrate
  dev` — its shadow DB breaks in this repo), and the SQL is *also* hand-saved as a loose `.sql`
  file under `packages/db/prisma/migrations/` for the record. See the files added in Phase 1 for
  the exact convention to follow for future changes.
- **Restart any already-running dev server after `db:push` + `db:generate`.** Turbopack/Node caches
  the old `@prisma/client` in memory for the lifetime of the process, so a long-running `next dev`
  started before a schema change will throw `Unknown field ... for select statement` errors on the
  new columns even though the DB and generated client are both correct. Hit this twice while
  building this feature — kill and restart it, don't debug the "bug" first.
- New env vars (see `.env.example`): `GS1_API_KEY` (required for live verification),
  `GS1_API_BASE_URL` (optional, defaults to `https://gtincheck.gs1uk.org`). Local check-digit
  validation works with neither set — only the "GTIN Verified" tier needs the key.

### The GS1 GTIN Check API integration

`apps/web/src/lib/gs1/client.ts` implements the real **GS1 UK GTIN Check API**
(`GTIN_Check_API_Developers_guide.pdf` v5.0, March 2024), replacing the earlier
placeholder. Confirmed working end-to-end 2026-07-27 with a live request against
`https://gtincheck.gs1uk.org` using the demo GTIN from the doc's own example
(`09506000134352`) — got back `CertaintyValue: 3, Status: "ACTIVE"` and the exact
`GTINTestResults`/`Summary`/`APIMessage` shape the doc describes.

**Request:** `POST {GS1_API_BASE_URL}` (defaults to `https://gtincheck.gs1uk.org` if unset),
`Authorization: Bearer {GS1_API_KEY}`, body `{ "gtins": ["<canonical14>"] }` — one GTIN per
call (the API supports up to ~1,000 per batch, but each product is verified independently here).

**Response mapping** (`verifyGtin()` in `client.ts`), driven by the doc's `CertaintyValue` (0-3)
and `Status` fields:
| CertaintyValue | Status | Our verdict |
|---|---|---|
| 0 or 1 | any | `GS1_NOT_FOUND` — no real GS1 company prefix on record |
| 2 | any | `GS1_NOT_FOUND` — real GCP owner found, but no full product match |
| 3 | not `ACTIVE` | `GS1_NOT_FOUND` — a real product record exists but its registration is inactive/discontinued (the doc's own first example, GTIN `05420071702255`, is exactly this case: CertaintyValue 3, Status "INACTIVE") |
| 3 | `ACTIVE` | `GS1_VERIFIED` — "GTIN Verified" badge |

Whenever CertaintyValue is 2 or 3 (a real GCP owner was found, regardless of the final verdict),
`data` is populated with whatever of these fields the API returned: `Status`, `BrandName`,
`ProductDescription`, `NetContent`, `CountryOfSaleCode`, `GPCCategoryName`, `GPCCategoryCode`,
`GCPOwner`, `GS1Territory`, `ProductImageUrl` — so the GTIN details view still has something
useful to show even for a `GS1_NOT_FOUND` badge (see [Viewing GTIN details](#viewing-gtin-details)).

**Badge wording:** the earlier "GS1 Verified"/"Verified by GS1" copy was renamed to **"GTIN
Verified"** everywhere per an explicit ask - grep for `GTIN Verified` to find every spot if it
needs to change again.

**Known gap:** Appendix 3 of the GS1 doc lists a much larger error-code table (104, 102, 103,
201-209, 301-306) that doesn't map cleanly onto any field actually present in the sample JSON
responses (`CertaintyValue`, `IntegrityCode`, `Status` are the only classification fields shown).
Our client only uses `CertaintyValue` + `Status`, which covers every case seen so far - if a real
error response ever surfaces a different field carrying one of those Appendix 3 codes, `client.ts`
would need updating to surface it (e.g. in the details view, for a clearer "why" than a bare
"Not in Registry" badge).

### Adding a GTIN to an existing product

The products table (`/dashboard/products`) has a dedicated **GTIN column** right after Name:
- A product with a GTIN shows its status badge ("GTIN Verified" / "Valid Format" / "Not in Registry").
- A product without one shows an **"Add GTIN"** pill that opens `ProductGtinEditModal`
  (`apps/web/src/components/dashboard/promption-table.tsx`) — same live-validation UX as the
  Add-Product page, calling `verifyGtinAction` on blur, then `updateProductGtinAction` on save.

`updateProductGtinAction` re-validates server-side exactly like `createPromptionAction` does
(never trusts the client), and rejects outright if the product already has a `gtin` — this action
is additive-only, not an editor for an already-set GTIN.

### Viewing GTIN details

`Product.gtinData` (`Json?`, migration `add_product_gtin_data.sql`) stores whatever the GS1 API
returned, captured whenever a real GCP owner was found (`CertaintyValue` 2 or 3 - see
[The GS1 GTIN Check API integration](#the-gs1-gtin-check-api-integration)), not just on a full
`GS1_VERIFIED` match — so a "Not in Registry" badge can still show useful info (e.g. who owns the
prefix) even without a confirmed product record. Written by `createPromptionAction` or
`updateProductGtinAction`, both via `resolveGtinForCreate`. It's a point-in-time snapshot, not a
live lookup, so viewing details never re-hits the external API.

Clicking any of the three GTIN status badges in the products table opens `GtinDetailsModal`
(`apps/web/src/components/dashboard/promption-table.tsx`) — a read-only view showing the GTIN,
status, and checked-at timestamp, plus a "From the GS1 registry" section listing whatever keys
`gtinData` has. Formatting is centralised in `apps/web/src/lib/gs1/format.ts`
(`availableGtinDetailEntries` → `humanizeGtinKey` + `formatGtinValue`), shared by this modal, the
`ProductGtinEditModal` add-GTIN flow, and the Add-Product page's live-check panel, so "only show
available fields" (null/undefined/empty-string/empty-object all filtered out) is enforced in one
place for all three surfaces. `ProductImageUrl` gets a small special-case: rendered as an actual
thumbnail (linking out to the full image) rather than a raw URL string, since the API does return
real product images.

### Re-checking a stale GTIN verification

`gtinStatus`/`gtinData`/`gtinVerifiedAt` are a **snapshot from whenever the GTIN was last
checked**, not a live value — they never update themselves. Two ways that snapshot goes stale in
practice: the GS1 registry's own data changes over time (a registration can go from inactive to
active, or vice versa), and — the concrete case that surfaced this — any GTIN checked while the
API integration was still a placeholder only ever got "Valid GTIN format," regardless of what GS1
actually had on file, because the real endpoint wasn't being called correctly yet.

`refreshGtinVerificationAction(productId)` (`apps/web/src/lib/dashboard/actions.ts`) re-runs
`verifyGtin()` against the *current* GTIN value and overwrites the stored status/data/timestamp —
it never touches the GTIN value itself, which is still set-once/immutable. `GtinDetailsModal` has
a "Re-check with GS1" button that calls it and updates both its own local view and the products
table row in place, via `refreshGtinVerification` in `use-promptions.ts`.

This is deliberately a manual, on-demand action, not automatic background re-verification —
re-checking every product's GTIN on a schedule would burn through the GS1 API's recommended usage
limits for no real benefit; a merchant re-checking the handful that look wrong is enough.

---

## Known gaps / infra dependencies

- **Custom-domain hosting** doesn't exist. `Company.customDomain` is display-only elsewhere in the
  app (a cosmetic browser-chrome mockup on the preview page) — there's no actual DNS/wildcard
  hosting wired up. The GS1 QR modal will happily build a URL against a company's custom domain if
  set, but that URL won't resolve anywhere until real custom-domain hosting is built.
- **An already-set GTIN still can't be changed or corrected** — only adding one where none existed
  is supported (see [Adding a GTIN to an existing product](#adding-a-gtin-to-an-existing-product)).
  If a company turns on `requireValidGtin` after already having published products without a GTIN,
  those products can now just have one added via the products table instead of being recreated —
  the "must recreate the product" rough edge from the original Phase 1 write-up is resolved.
- **`QrCode`/`QrScan` Prisma models are effectively dead code** (only written once on publish,
  never read anywhere in the app) — the GS1 QR surface deliberately does **not** touch them; it
  rides entirely on the existing `PageView`/`trackPageView` pipeline, exactly like every other scan
  type.

---

## Phase 2 — Authentication editor element (not built)

**Goal:** a new visual-editor element, selectable as either a popup-trigger button or an embedded
inline widget, that shows a customer the product's GS1-verification status and links out to a GS1
verification page.

**Direct template to copy:** `packages/editor/src/elements/feedback-element.tsx` +
`packages/editor/src/elements/feedback-sheet.tsx`. That's the existing "button that opens a
bottom-sheet" pattern — it already solves the exact popup-vs-embedded problem this element needs:

- Every element lives in one file under `packages/editor/src/elements/*.tsx`, registered via
  `registerElement({...})` from `packages/editor/src/elements/registry.ts` (`ElementDefinition`:
  `type`, `label`, `icon`, `category`, `defaultProps`, `defaultTransform`, `component`,
  `propertyPanel`). New file needs one more line in the barrel,
  `packages/editor/src/elements/index.ts` (`import "./auth-element";`).
- `feedback-element.tsx` renders a `<button>` that flips `open=true`, conditionally mounting a
  sheet component; it reads `usePublicPage()` (`packages/editor/src/renderer/public-page-context.tsx`)
  for `productId`/`portalRoot`, and checks `isInsideEditor()` to stay inert while editing.
- For the auth element: add a `displayMode: "popup" | "inline"` prop in `defaultProps`, branch the
  render component on it — `"popup"` reuses the button→sheet pattern, `"inline"` renders the
  verification content directly with no `open` state.
- The verification content itself needs the product's `gtin`/`gtinStatus` — that's not currently
  exposed through `usePublicPage()`'s page-context shape (it only carries what `publicProfileShape()`
  in `actions.ts` returns), so plan to add `gtin`/`gtinStatus` there too, alongside a link built
  from... whatever the real GS1 consumer-facing verification page turns out to be (not yet
  decided — the roadmap only specified "link to the GS1 verification website").

**Property panel:** follow `feedback-fields-config.tsx`'s multi-tab pattern (used by
`feedback-element.tsx`'s property panel) if the auth element ends up needing more than one settings
tab (e.g. a "content" tab for copy/logo choice, an "appearance" tab for popup vs inline + colors).

---

## Phase 2 — "Authenticity click" analytics metric (not built)

**Goal:** count and surface how many times a visitor clicked/opened the Authentication element on
a public page.

**Where it plugs in:**
- Recording the click needs a new lightweight tracked event — either a new column on `PageView`
  (e.g. `authenticityClickedAt`, cheapest if "did they ever click it this session" is enough) or a
  small new table if you need multiple clicks per view recorded. Follow the `recordViewDuration`
  pattern in `apps/web/src/lib/analytics/track-page-view.ts` (a beacon-style POST from the client,
  re-deriving the same `(visitor, page, day)` identity) for a click-tracking beacon endpoint —
  probably a new `/api/analytics/authenticity-click` route mirroring `/api/analytics/duration`.
- Surfacing it: `getCompanyAnalyticsAction` and `getProductAnalyticsAction`
  (`apps/web/src/lib/dashboard/actions.ts`) already aggregate `PageView` with `prisma.pageView.count`
  /`groupBy` — add the new column/table into those aggregations the same way `scansLast7Days` etc.
  are computed today, then thread the new field through `use-analytics.ts`'s `AnalyticsStats`
  interface and into `analytics-charts.tsx` / `product-detail-modal.tsx`'s stat tiles.

---

## Phase 3 — Connect vs Enterprise plan gating (not built)

**Goal:** two tiers — **Productix Connect** ("Basic GS1 QR + Visual Builder, Feedbacks + Basic
Analytics on scans count") and **Productix Enterprise** ("all features") — with no billing
integration (per an explicit product decision: reuse the existing admin-assigned plan field, no
Stripe).

**What already exists to build on:**
- `Company.subscriptionPlan` (`SubscriptionPlan` enum: `FREE | BASIC | PREMIUM | ENTERPRISE`) and
  `subscriptionStatus` already exist in the schema and are already set per-company by SUPER_ADMIN
  today (`apps/web/src/components/admin/company-table.tsx`, `create-company-modal.tsx`). Right now
  they're **purely informational** — nothing in the app branches behavior off them.
- There is **no feature-flag mechanism anywhere** in the codebase (no JSON column, no flag table).
  This will be greenfield.

**Suggested approach:**
1. Decide the mapping: does "Connect" = the existing `BASIC` enum value, or do you want a
   dedicated `CONNECT`/`ENTERPRISE` pair (clearer naming, small migration)? Either works technically.
2. Add a small `hasFeature(company, feature)` helper (e.g. in `apps/web/src/lib/dashboard/` or
   `packages/utils`) that maps a plan value to an allowed feature set — start with just the
   features named in the roadmap: GS1 QR (already unconditional today — decide if Connect should
   really get *basic* GS1 QR only, e.g. no custom-domain option), visual builder, feedbacks, basic
   scan-count analytics vs. the fuller analytics (`scanToFeedbackRatio`, `feedbackResolutionRate`,
   `topProducts`, `productBreakdowns`, branch-scoped analytics, etc. — all already computed in
   `getCompanyAnalyticsAction` and would need to be Enterprise-only).
3. Gate the Authentication editor element (Phase 2) and the fuller analytics behind this helper as
   the two concrete "Enterprise-only" features named in the roadmap; expand from there as more
   detail is decided.
4. No Stripe/checkout work is in scope — SUPER_ADMIN keeps assigning plans the way they do today.

---

## Appendix: GTIN check-digit algorithm

Implemented in `apps/web/src/lib/gs1/check-digit.ts`. Per GS1 General Specifications §7.9: weight
the rightmost digit of the payload (the GTIN minus its check digit) as 3, then alternate 1, 3, 1,
3… moving left; check digit = `(10 - (sum % 10)) % 10`. Hand-verified against the well-known EAN-13
test number `4006381333931` (payload `400638133393`, computed check digit `1`, matching the real
last digit).
