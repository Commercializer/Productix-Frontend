/* ─────────────────────────────────────────────
 * GET /api/branches?productId=<uuid>
 *
 * Public endpoint used by the feedback form's branch
 * picker on published product pages. Returns the active
 * branches of the company that owns the product, so a
 * visitor can say which location their feedback is about.
 * Intentionally public (no auth) and exposes only id + name.
 * ──────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@productix/db";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId || !UUID_RE.test(productId)) {
    return NextResponse.json({ error: "Invalid product reference" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { companyId: true },
  });
  if (!product) return NextResponse.json({ items: [] });

  const branches = await prisma.branch.findMany({
    where: { companyId: product.companyId, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json({ items: branches });
}
