/* ─────────────────────────────────────────────
 * POST /api/feedback - Public feedback submission
 *
 * Accepts JSON { productId, name, phone, email?, details }.
 * Looks up the product to derive the owning companyId,
 * then stores the entry as a FeedbackInquiry of type
 * FEEDBACK. The endpoint is intentionally public so
 * visitors of a published product page can submit without
 * signing in.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@productix/db";

interface FeedbackPayload {
  productId?: string | null;
  name?: string;
  phone?: string;
  email?: string;
  details?: string;
  /** Extra author-defined fields, keyed by their label. */
  extra?: Record<string, unknown>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  // Normalize the extra payload into label → string entries, dropping anything
  // empty or too long so a misconfigured form can't fill the description with
  // unbounded data.
  const extraEntries: Array<[string, string]> = [];
  if (body.extra && typeof body.extra === "object" && !Array.isArray(body.extra)) {
    for (const [key, raw] of Object.entries(body.extra)) {
      const k = String(key).trim().slice(0, 100);
      const v = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
      if (k.length > 0 && v.length > 0 && v.length <= 2000) {
        extraEntries.push([k, v]);
      }
    }
  }

  // The form author can toggle off any of name/phone/details, so the only
  // hard requirement is that *something* identifying was provided.
  const hasAnyInput = name.length > 0 || phone.length > 0 || email.length > 0 || details.length > 0 || extraEntries.length > 0;
  if (!hasAnyInput) {
    return NextResponse.json({ error: "Please fill in at least one field" }, { status: 400 });
  }
  if (name.length > 255 || phone.length > 50 || email.length > 255) {
    return NextResponse.json({ error: "Field exceeds maximum length" }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ error: "Product reference is missing" }, { status: 400 });
  }

  // Schema requires non-null name + description, so substitute placeholders
  // when the author disabled those fields in the form.
  const safeName = name || "Anonymous";
  const composedDescription = (() => {
    const parts: string[] = [];
    if (details) parts.push(details);
    if (extraEntries.length > 0) {
      parts.push(extraEntries.map(([k, v]) => `${k}: ${v}`).join("\n"));
    }
    return parts.join("\n\n") || "(no details provided)";
  })();

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

  try {
    const created = await prisma.feedbackInquiry.create({
      data: {
        companyId: product.companyId,
        productId: product.id,
        type: "FEEDBACK",
        name: safeName,
        // The schema requires a non-null email; store empty string when the
        // visitor leaves the optional field blank.
        email,
        phoneNumber: phone || null,
        description: composedDescription,
        status: "NEW",
      },
      select: { id: true },
    });
    return NextResponse.json({ success: true, id: created.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save feedback";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
