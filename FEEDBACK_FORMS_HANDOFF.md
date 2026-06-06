# Feedback Forms + Structured Analytics — Handoff

> Continuation doc for the **custom feedback form builder + structured feedback analytics** feature.
> Hand this to a fresh chat to pick up where we left off.

## TL;DR — current state

- **All code is written and type-checks clean** (`@productix/editor` and `@productix/web` both pass `tsc --noEmit`).
- **The database schema has been applied** to the Supabase DB via `prisma db push` (verified in sync — `migrate diff` reports "No difference detected").
- **One open action:** the running Next dev server must be **fully restarted** to pick up the regenerated Prisma client (see "Known issue" below). Until then you get `Cannot read properties of undefined (reading 'findFirst')` because `prisma.branch` is undefined in the stale process.
- **Not yet done:** end-to-end manual verification in the running app (build a form → submit from a published page → confirm dashboard filters). Optional but recommended.

## Environment notes

- Monorepo, **pnpm@11.1.2**, requires **Node ≥ 22.13**. System node is 22.11 (too old for pnpm) — use nvm:
  ```bash
  export PATH="$HOME/.nvm/versions/node/v22.13.1/bin:$PATH"
  ```
- DB CLI uses `DIRECT_URL` (port 5432, direct) per `packages/db/prisma.config.ts`. This is a **shared/hosted Supabase** instance — schema mutations require explicit authorization.
- This repo does **not** use `prisma migrate dev` (its shadow DB breaks: the `00000000000001_rls_policies` migration sorts before table creation). Schema is applied with **`prisma db push`**, and SQL is also saved as loose `.sql` files under `packages/db/prisma/migrations/`.

## What the feature does

A form builder in the page editor lets authors add rating/choice fields (stars, emoji/happiness, select, multi-select, NPS, date, slider, branch picker) on top of the existing text fields. Answers are stored **structurally** (not flattened into a text blob), so the dashboard can **filter feedback by Branch, Category, and custom selections**, and show **average ratings**.

## Data model (applied to DB)

In `packages/db/prisma/schema.prisma`:

- **`Branch`** — company-scoped location (`name`, `city?`, `address?`, `isActive`). `@@unique([companyId, name])`.
- **`FeedbackForm`** — reusable template, `fields Json` (snapshot of builder config). *(Model exists; not yet wired into a save/load UI — see "Future work".)*
- **`FeedbackAnswer`** — one row per answered field: `fieldId`, `label`, `fieldType`, `valueText?`, `valueNumber?`, `valueOptions String[]`.
- **`FeedbackInquiry`** gained: `branchId?`, `feedbackFormId?`, `ratingScore?` (normalized 1–5 avg of star/emoji/nps), plus `answers FeedbackAnswer[]` and `@@index([branchId])`.
- **`Company`** gained back-relations `branches`, `feedbackForms`.

Saved SQL: `packages/db/prisma/migrations/add_feedback_forms_branches.sql` (purely additive — 3 tables, 3 nullable columns, indexes, FKs; no data loss).

> Note: `packages/db/src/index.ts` re-exports Prisma types but was **not** updated to export `Branch`/`FeedbackForm`/`FeedbackAnswer` types. Not required (runtime uses `prisma.branch` directly), but add them for consistency if convenient.

## Files changed / added

| Area | File | Status |
|---|---|---|
| Schema | `packages/db/prisma/schema.prisma` | edited |
| Migration SQL | `packages/db/prisma/migrations/add_feedback_forms_branches.sql` | new |
| Branch CRUD + feedback read | `apps/web/src/lib/dashboard/actions.ts` | edited |
| Branch management UI | `apps/web/src/components/dashboard/branch-manager.tsx` | new |
| Settings page (mounts BranchManager) | `apps/web/src/app/(dashboard)/dashboard/settings/page.tsx` | edited |
| Field types + value store + rendering + submit | `packages/editor/src/elements/feedback-sheet.tsx` | edited |
| Form-builder property panel | `packages/editor/src/elements/feedback-element.tsx` | edited |
| Public branches endpoint | `apps/web/src/app/api/branches/route.ts` | new |
| Structured feedback storage | `apps/web/src/app/api/feedback/route.ts` | rewritten |
| Message type | `apps/web/src/hooks/use-messages.ts` | edited |
| Dashboard filters + display | `apps/web/src/app/(dashboard)/dashboard/feedbacks/page.tsx` | edited |

## Key implementation details

- **Field types** (`FeedbackFieldType` in `feedback-sheet.tsx`): `text | textarea | tel | email | number | image | star | emoji | select | multiselect | nps | date | slider | branch`.
- **Value store** in the sheet is `Record<string, string | string[] | number>`. Ratings store numbers, choices store arrays, everything else strings.
- **Emoji scale**: `["😠","🙁","😐","🙂","😄"]` → score 1–5.
- **Submit payload** (`POST /api/feedback`): `{ productId, name, phone, email, details, branchId, answers: [{fieldId,label,type,value,max?}] }`. Branch field is sent as `branchId`, not as a generic answer.
- **ratingScore normalization** (server, `api/feedback/route.ts`): star → `value/max*5`, emoji → `value` (1–5), nps → `value/10*5`. Slider is stored but **excluded** from ratingScore.
- **Back-compat**: the route still composes the legacy `description` text (details + `Label: value` lines + `Branch: name`) so the old detail viewer / image extraction keep working, and still accepts the deprecated `extra` map for pages published before this change.
- **Branch picker** loads options from `GET /api/branches?productId=<uuid>` (public, returns active branches of the product's company). Only fetches when a branch field is present and the sheet is open. **Does not populate in the editor preview** (needs published product context).
- **Dashboard filters** (`feedbacks/page.tsx`): Branch + Category (derived from messages), and a two-step **custom-selection** filter (pick a select/multiselect field label → pick a value). Custom-selection filter only sees `select`/`multiselect` answers (via `valueOptions`). Avg-rating chip computed over the filtered set.

## Branch CRUD server actions (in `actions.ts`)

`getBranchesAction`, `createBranchAction({name,city?,address?})`, `updateBranchAction(id, patch)`, `deleteBranchAction(id)` — all scoped via the existing `getUserCompanyId(session.user.id)` helper. Deleting a branch keeps feedback (FK is `onDelete: SetNull`).

## Known issue (do this first)

**Restart the dev server.** It was started before the Prisma client was regenerated, so it holds an old client where `prisma.branch` is undefined → `findFirst` of undefined. HMR won't fix it (node_modules isn't reloaded) and `client.ts` caches the client on `globalThis.prisma`. Fully stop and restart:

```bash
# Ctrl+C the running dev server, then:
export PATH="$HOME/.nvm/versions/node/v22.13.1/bin:$PATH"
pnpm --filter @productix/web dev
```

If the client ever seems stale again, regenerate then restart:
```bash
pnpm --filter @productix/db exec prisma generate
```

## How to use (author flow)

1. **Settings → Branches**: add locations (needed for the branch picker).
2. Open a product → **Edit page** (editor). Select/drag the **Feedback** element.
3. Property panel tabs: **Button** (trigger look) · **Fields** (build the form) · **Copy** (popup text) · **Submit** (popup button style).
4. **Fields tab**: toggle built-ins (Name/Phone/Email/Details); **+ Add field** for custom ones — set label, type (Text/Rating/Choice groups), required, and per-type config (choices / star count / slider min-max-step).
5. **Save → Publish.** Submissions appear in **Dashboard → Customer Feedbacks**, filterable by branch/category/custom selection, with rating display + average chip.

## Verification checklist (remaining)

1. Restart dev server (above).
2. Settings → create 2 branches; confirm `GET /api/branches?productId=<id>` returns them.
3. Editor → add star + emoji + multiselect (with options) + branch fields; confirm config UIs persist in the document.
4. Publish, open the live page, submit → expect 200; check DB for a `FeedbackInquiry` with `branchId`/`ratingScore` + `FeedbackAnswer` rows.
5. Dashboard → confirm branch/category/custom-selection filters narrow results; legacy (pre-migration) feedback still renders via `description`.
6. (CI) `pnpm --filter @productix/editor type-check` and `pnpm --filter @productix/web type-check` — both currently pass.

## Possible future work (not started)

- **Save/load `FeedbackForm` templates** — the model exists but the editor still stores fields inline in element props; no template picker/save UI yet.
- Export `Branch`/`FeedbackForm`/`FeedbackAnswer` types from `packages/db/src/index.ts`.
- Analytics rollups using `ratingScore` (e.g. avg rating per branch over time) in the analytics dashboard.
- Additional field types if desired (yes/no toggle, country-code phone, file attachments beyond images).
- Minor: a few pre-existing Sonar lint warnings in `feedbacks/page.tsx` (cognitive complexity, array-index keys) — not introduced by correctness issues.

## Original plan

Full approved plan saved at: `~/.claude/plans/snug-whistling-pizza.md`
