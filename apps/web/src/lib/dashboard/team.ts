"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@productix/db";
import { auth } from "@/auth";

/**
 * Resolve the company the signed-in COMPANY_ADMIN manages.
 * Throws if the caller is not a company admin or has no company.
 */
async function requireCallerCompanyId(): Promise<string> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId || role !== "COMPANY_ADMIN") {
    throw new Error("Forbidden");
  }

  const link = await prisma.companyAdmin.findUnique({
    where: { userId },
    select: { companyId: true },
  });

  if (!link) {
    throw new Error("You are not linked to a company.");
  }
  return link.companyId;
}

export async function listTeamMembersAction() {
  const companyId = await requireCallerCompanyId();

  const [admins, members, company] = await Promise.all([
    prisma.companyAdmin.findMany({
      where: { companyId },
      include: { user: true },
    }),
    prisma.companyUser.findMany({
      where: { companyId },
      include: { user: true },
    }),
    prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true, maximumUsers: true },
    }),
  ]);

  const rows = [
    ...admins.map((a) => ({
      membershipId: a.id,
      membershipType: "ADMIN" as const,
      userId: a.user.id,
      email: a.user.email,
      role: a.user.role,
      isActive: a.user.isActive,
      createdAt: a.createdAt.toISOString(),
      lastSignIn: a.user.lastSignInAt?.toISOString() ?? null,
    })),
    ...members.map((m) => ({
      membershipId: m.id,
      membershipType: "USER" as const,
      userId: m.user.id,
      email: m.user.email,
      role: m.user.role,
      isActive: m.user.isActive,
      createdAt: m.createdAt.toISOString(),
      lastSignIn: m.user.lastSignInAt?.toISOString() ?? null,
    })),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return {
    companyName: company?.name ?? "",
    maximumUsers: company?.maximumUsers ?? 0,
    members: rows,
  };
}

export interface CreateTeamMemberInput {
  email: string;
  password: string;
  role: "COMPANY_ADMIN" | "COMPANY_USER";
}

export async function createTeamMemberAction(input: CreateTeamMemberInput) {
  const companyId = await requireCallerCompanyId();

  if (!input.email?.trim() || !input.password || input.password.length < 8) {
    return { error: "Email and a password of at least 8 characters are required." };
  }
  if (input.role !== "COMPANY_ADMIN" && input.role !== "COMPANY_USER") {
    return { error: "Invalid role." };
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        maximumUsers: true,
        _count: { select: { admins: true, users: true } },
      },
    });
    if (!company) return { error: "Company not found." };

    const current = company._count.admins + company._count.users;
    if (current >= company.maximumUsers) {
      return { error: `Seat limit reached (${company.maximumUsers}).` };
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email.trim().toLowerCase(),
          passwordHash,
          role: input.role,
          isActive: true,
        },
      });
      if (input.role === "COMPANY_ADMIN") {
        await tx.companyAdmin.create({ data: { companyId, userId: user.id } });
      } else {
        await tx.companyUser.create({ data: { companyId, userId: user.id } });
      }
    });

    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "That email is already in use." };
    }
    return { error: error?.message ?? "Failed to create team member." };
  }
}

export async function removeTeamMemberAction(userId: string) {
  const companyId = await requireCallerCompanyId();

  // Verify the target actually belongs to this company before deleting,
  // so an admin can't remove users from another company.
  const inCompany =
    (await prisma.companyAdmin.findFirst({ where: { companyId, userId } })) ??
    (await prisma.companyUser.findFirst({ where: { companyId, userId } }));

  if (!inCompany) {
    return { error: "User is not a member of your company." };
  }

  try {
    // Cascade on User → CompanyAdmin/CompanyUser will clean up the membership.
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to remove team member." };
  }
}

export async function toggleTeamMemberActiveAction(userId: string, disable: boolean) {
  const companyId = await requireCallerCompanyId();

  const inCompany =
    (await prisma.companyAdmin.findFirst({ where: { companyId, userId } })) ??
    (await prisma.companyUser.findFirst({ where: { companyId, userId } }));

  if (!inCompany) {
    return { error: "User is not a member of your company." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !disable },
    });
    revalidatePath("/dashboard/team");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to update member." };
  }
}
