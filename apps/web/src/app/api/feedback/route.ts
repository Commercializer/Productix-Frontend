/* ─────────────────────────────────────────────
 * POST /api/feedback - Public feedback submission
 *
 * Accepts JSON { productId, name, phone, email?, details,
 * branchId?, answers? }. Looks up the product to derive the
 * owning companyId, then stores the entry as a FeedbackInquiry
 * of type FEEDBACK together with structured FeedbackAnswer rows
 * (so ratings and custom selections can be filtered/aggregated
 * in the dashboard) and a denormalized ratingScore.
 *
 * The endpoint is intentionally public so visitors of a
 * published product page can submit without signing in.
 *
 * The legacy `extra` payload (label -> string) is still accepted
 * for already-published pages until they are re-published.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@productix/db";

type AnswerValue = string | string[] | number;

interface AnswerPayload {
  fieldId?: string;
  label?: string;
  type?: string;
  value?: AnswerValue;
  max?: number;
}

interface FeedbackPayload {
  productId?: string | null;
  name?: string;
  phone?: string;
  email?: string;
  details?: string;
  branchId?: string | null;
  answers?: AnswerPayload[];
  /** Deprecated: author-defined fields keyed by label. */
  extra?: Record<string, unknown>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RATING_TYPES = new Set(["star", "emoji", "nps", "slider"]);
const CHOICE_TYPES = new Set(["select", "multiselect"]);
// Types that contribute to the normalized 1-5 ratingScore.
const SCORE_TYPES = new Set(["star", "emoji", "nps"]);

/** A normalized, validated answer ready to persist. */
interface NormalizedAnswer {
  fieldId: string;
  label: string;
  fieldType: string;
  valueText: string | null;
  valueNumber: number | null;
  valueOptions: string[];
  /** Display string used to compose the legacy description text. */
  display: string;
  /** 0..5 normalized score, or null when this field isn't a rating. */
  score: number | null;
}

function normalizeAnswer(a: AnswerPayload): NormalizedAnswer | null {
  const fieldId = String(a.fieldId ?? "").trim().slice(0, 100);
  const label = String(a.label ?? "").trim().slice(0, 255);
  const type = String(a.type ?? "").trim().slice(0, 50);
  if (!fieldId || !label || !type) return null;

  let valueText: string | null = null;
  let valueNumber: number | null = null;
  let valueOptions: string[] = [];
  let display = "";
  let score: number | null = null;

  if (RATING_TYPES.has(type)) {
    const n = Number(a.value);
    if (!Number.isFinite(n)) return null;
    valueNumber = n;
    if (type === "star") {
      const max = Number.isFinite(a.max) ? Math.max(2, Math.min(10, Number(a.max))) : 5;
      display = `${n}/${max}`;
      score = (n / max) * 5;
    } else if (type === "emoji") {
      display = `${n}/5`;
      score = n; // already 1..5
    } else if (type === "nps") {
      display = `${n}/10`;
      score = (n / 10) * 5;
    } else {
      display = String(n); // slider - not part of ratingScore
    }
  } else if (CHOICE_TYPES.has(type)) {
    const arr = Array.isArray(a.value) ? a.value : a.value != null ? [a.value] : [];
    valueOptions = arr.map((v) => String(v).trim()).filter((v) => v.length > 0 && v.length <= 500).slice(0, 50);
    if (valueOptions.length === 0) return null;
    display = valueOptions.join(", ");
  } else {
    const v = typeof a.value === "string" ? a.value.trim() : a.value == null ? "" : String(a.value).trim();
    if (v.length === 0 || v.length > 2000) return null;
    valueText = v;
    display = v;
  }

  return { fieldId, label, fieldType: type, valueText, valueNumber, valueOptions, display, score };
}

export async function POST(request: NextRequest) {
  let body: FeedbackPayload;
  try {
    body = (await request.json()) as FeedbackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const details = (body.details ?? "").trim();
  const productId = body.productId && UUID_RE.test(body.productId) ? body.productId : null;

  // Normalize the structured answers.
  const normalized: NormalizedAnswer[] = [];
  if (Array.isArray(body.answers)) {
    for (const a of body.answers) {
      const n = normalizeAnswer(a);
      if (n) normalized.push(n);
    }
  }

  // Back-compat: accept the deprecated label->string `extra` map when no
  // structured answers were sent (pages published before the form-builder update).
  if (normalized.length === 0 && body.extra && typeof body.extra === "object" && !Array.isArray(body.extra)) {
    let i = 0;
    for (const [key, raw] of Object.entries(body.extra)) {
      const label = String(key).trim().slice(0, 255);
      const v = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
      if (label.length > 0 && v.length > 0 && v.length <= 2000) {
        normalized.push({
          fieldId: `legacy_${i++}`,
          label,
          fieldType: "text",
          valueText: v,
          valueNumber: null,
          valueOptions: [],
          display: v,
          score: null,
        });
      }
    }
  }

  const hasAnyInput =
    name.length > 0 || phone.length > 0 || email.length > 0 || details.length > 0 || normalized.length > 0 || !!body.branchId;
  if (!hasAnyInput) {
    return NextResponse.json({ error: "Please fill in at least one field" }, { status: 400 });
  }
  if (name.length > 255 || phone.length > 50 || email.length > 255) {
    return NextResponse.json({ error: "Field exceeds maximum length" }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ error: "Product reference is missing" }, { status: 400 });
  }

  // Resolve the company that owns this product so the feedback shows up on the
  // right dashboard. If the product cannot be found we refuse to store the
  // submission rather than parking it against an arbitrary company.
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, companyId: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Validate the branch belongs to this company; ignore an invalid/foreign
  // branch rather than rejecting the whole submission.
  let branchId: string | null = null;
  let branchName: string | null = null;
  if (body.branchId && UUID_RE.test(body.branchId)) {
    const branch = await prisma.branch.findFirst({
      where: { id: body.branchId, companyId: product.companyId },
      select: { id: true, name: true },
    });
    if (branch) {
      branchId = branch.id;
      branchName = branch.name;
    }
  }

  // Compute the average normalized rating (1-5) across scoring fields.
  const scores = normalized.map((n) => n.score).filter((s): s is number => s != null);
  const ratingScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  // Compose a human-readable description for back-compat: the legacy detail
  // viewer, search, and image-extraction all read this field.
  const composedDescription = (() => {
    const parts: string[] = [];
    if (details) parts.push(details);
    if (branchName) parts.push(`Branch: ${branchName}`);
    if (normalized.length > 0) {
      parts.push(normalized.map((n) => `${n.label}: ${n.display}`).join("\n"));
    }
    return parts.join("\n\n") || "(no details provided)";
  })();

  const safeName = name || "Anonymous";

  try {
    const created = await prisma.$transaction(async (tx) => {
      const inquiry = await tx.feedbackInquiry.create({
        data: {
          companyId: product.companyId,
          productId: product.id,
          branchId,
          type: "FEEDBACK",
          name: safeName,
          // The schema requires a non-null email; store empty string when blank.
          email,
          phoneNumber: phone || null,
          description: composedDescription,
          ratingScore,
          status: "NEW",
        },
        select: { id: true },
      });

      if (normalized.length > 0) {
        await tx.feedbackAnswer.createMany({
          data: normalized.map((n) => ({
            feedbackInquiryId: inquiry.id,
            fieldId: n.fieldId,
            label: n.label,
            fieldType: n.fieldType,
            valueText: n.valueText,
            valueNumber: n.valueNumber,
            valueOptions: n.valueOptions,
          })),
        });
      }

      return inquiry;
    });
    return NextResponse.json({ success: true, id: created.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save feedback";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
