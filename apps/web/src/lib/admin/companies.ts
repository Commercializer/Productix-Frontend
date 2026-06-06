"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@productix/db";
import { auth } from "@/auth";
import { computeSeatUsage } from "@/lib/seats";

async function requireSuperAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;
  if (role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function listTenantsAction() {
  await requireSuperAdmin();
  const tenants = await prisma.tenant.findMany({
    select: { id: true, name: true, _count: { select: { companies: true } } },
    orderBy: { name: "asc" },
  });
  // companyCount lets callers warn when a tenant has no company to manage yet.
  return tenants.map((t) => ({
    id: t.id,
    name: t.name,
    companyCount: t._count.companies,
  }));
}

export async function listCompaniesAction() {
  await requireSuperAdmin();
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      businessUsername: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      maximumUsers: true,
      isActive: true,
      createdAt: true,
      tenant: { select: { id: true, name: true } },
      _count: { select: { admins: true, users: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return companies.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    businessUsername: c.businessUsername,
    subscriptionPlan: c.subscriptionPlan,
    subscriptionStatus: c.subscriptionStatus,
    maximumUsers: c.maximumUsers,
    isActive: c.isActive,
    createdAt: c.createdAt.toISOString(),
    tenantId: c.tenant.id,
    tenantName: c.tenant.name,
    // Seats consumed against the limit — the owner admin is free, so this
    // counts only the members added on top of them.
    memberCount: computeSeatUsage(c._count.admins, c._count.users, c.maximumUsers).used,
  }));
}

export interface CreateCompanyInput {
  name: string;
  email: string;
  businessUsername: string;
  subscriptionPlan: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  maximumUsers: number;
  // Either pick an existing tenant or create one inline
  tenantId?: string;
  newTenantName?: string;
  newTenantEmail?: string;
  // Optional initial admin user
  adminEmail?: string;
  adminPassword?: string;
}

export async function createCompanyAction(input: CreateCompanyInput) {
  await requireSuperAdmin();

  if (!input.name?.trim() || !input.email?.trim() || !input.businessUsername?.trim()) {
    return { error: "Name, email, and business username are required." };
  }

  if (!input.tenantId && !input.newTenantName?.trim()) {
    return { error: "Pick an existing tenant or provide a new tenant name." };
  }

  if (input.adminEmail && (!input.adminPassword || input.adminPassword.length < 8)) {
    return { error: "Admin password must be at least 8 characters." };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Resolve tenant - either reuse an existing one or create on the fly.
      let tenantId = input.tenantId;
      if (!tenantId) {
        const tenant = await tx.tenant.create({
          data: {
            name: input.newTenantName!.trim(),
            email: (input.newTenantEmail || input.email).trim(),
            tenantType: "CORPORATE",
          },
        });
        tenantId = tenant.id;
      }

      const company = await tx.company.create({
        data: {
          tenantId,
          name: input.name.trim(),
          email: input.email.trim(),
          businessUsername: input.businessUsername.trim(),
          subscriptionPlan: input.subscriptionPlan,
          maximumUsers: input.maximumUsers,
        },
      });

      // Optionally create an initial COMPANY_ADMIN user for this company.
      if (input.adminEmail && input.adminPassword) {
        const passwordHash = await bcrypt.hash(input.adminPassword, 10);
        const user = await tx.user.create({
          data: {
            email: input.adminEmail.trim().toLowerCase(),
            passwordHash,
            role: "COMPANY_ADMIN",
            isActive: true,
          },
        });
        await tx.companyAdmin.create({
          data: { companyId: company.id, userId: user.id },
        });
      }

      return company;
    });

    revalidatePath("/admin/companies");
    return { companyId: result.id };
  } catch (error: any) {
    if (error?.code === "P2002") {
      const target = error?.meta?.target?.toString?.() ?? "";
      if (target.includes("email")) {
        return { error: "That email is already in use." };
      }
      return { error: "A record with that value already exists." };
    }
    return { error: error?.message ?? "Failed to create company." };
  }
}

/**
 * Update a company's seat limit (maximum number of users). Super-admin only.
 * The new limit can't be set below the number of seats already occupied.
 */
export async function updateCompanySeatLimitAction(companyId: string, maximumUsers: number) {
  await requireSuperAdmin();

  const limit = Math.floor(Number(maximumUsers));
  if (!Number.isFinite(limit) || limit < 1) {
    return { error: "Seat limit must be a positive whole number." };
  }
  if (limit > 1000) {
    return { error: "Seat limit is unreasonably high (max 1000)." };
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { _count: { select: { admins: true, users: true } } },
    });
    if (!company) return { error: "Company not found." };

    // The owner admin is free; only the members added on top count toward the limit.
    const { used } = computeSeatUsage(company._count.admins, company._count.users, limit);
    if (limit < used) {
      return { error: `Company already has ${used} members. Remove members before lowering the limit below that.` };
    }

    await prisma.company.update({
      where: { id: companyId },
      data: { maximumUsers: limit },
    });

    revalidatePath("/admin/companies");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to update seat limit." };
  }
}

/**
 * Rename a company. Super-admin only.
 */
export async function renameCompanyAction(companyId: string, name: string) {
  await requireSuperAdmin();

  const trimmed = name?.trim();
  if (!trimmed) {
    return { error: "Company name is required." };
  }
  if (trimmed.length > 100) {
    return { error: "Company name is too long (max 100 characters)." };
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { id: true },
    });
    if (!company) return { error: "Company not found." };

    await prisma.company.update({
      where: { id: companyId },
      data: { name: trimmed },
    });

    revalidatePath("/admin/companies");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to rename company." };
  }
}

export async function deleteCompanyAction(companyId: string) {
  await requireSuperAdmin();
  try {
    await prisma.company.delete({ where: { id: companyId } });
    revalidatePath("/admin/companies");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to delete company." };
  }
}
