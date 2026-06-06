"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@productix/db";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/email";
import { buildWelcomeEmail } from "@/lib/email/templates";
import { computeSeatUsage } from "@/lib/seats";

/** Resolve the email of the signed-in caller (used for "invited by" copy). */
async function callerEmail(): Promise<string | undefined> {
  const session = await auth();
  return (session?.user as any)?.email as string | undefined;
}

/**
 * Resolve the company the signed-in manager (COMPANY_ADMIN or TENANT_ADMIN)
 * administers. Company admins use their direct company link; tenant admins act
 * on the first company under their tenant. Throws if the caller isn't a manager
 * or has no resolvable company.
 */
async function requireCallerCompanyId(): Promise<string> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as string | undefined;

  if (!userId || (role !== "COMPANY_ADMIN" && role !== "TENANT_ADMIN")) {
    throw new Error("Forbidden");
  }

  if (role === "COMPANY_ADMIN") {
    const link = await prisma.companyAdmin.findUnique({
      where: { userId },
      select: { companyId: true },
    });
    if (!link) {
      throw new Error("You are not linked to a company.");
    }
    return link.companyId;
  }

  // TENANT_ADMIN → first company under their tenant.
  const tenantLink = await prisma.tenantAdmin.findUnique({
    where: { userId },
    select: {
      tenant: {
        select: {
          companies: { select: { id: true }, orderBy: { createdAt: "asc" }, take: 1 },
        },
      },
    },
  });
  const companyId = tenantLink?.tenant.companies[0]?.id;
  if (!companyId) {
    throw new Error("Your tenant has no company yet.");
  }
  return companyId;
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

  const maximumUsers = company?.maximumUsers ?? 0;
  // The owner admin (assigned when the company was created) is a free seat;
  // `maximumUsers` counts only the members the admin adds on top of that.
  const { used: seatsUsed, remaining: seatsRemaining } = computeSeatUsage(
    admins.length,
    members.length,
    maximumUsers
  );

  return {
    companyName: company?.name ?? "",
    maximumUsers,
    seatsUsed,
    seatsRemaining,
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
        name: true,
        maximumUsers: true,
        _count: { select: { admins: true, users: true } },
      },
    });
    if (!company) return { error: "Company not found." };

    // The owner admin doesn't consume a seat; only members added on top do.
    const { remaining } = computeSeatUsage(
      company._count.admins,
      company._count.users,
      company.maximumUsers
    );
    if (remaining <= 0) {
      return { error: `Seat limit reached (${company.maximumUsers}).` };
    }

    const email = input.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(input.password, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
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

    // Best-effort welcome email with login credentials. A failure here must not
    // roll back the user creation, so it runs after the transaction commits.
    const { subject, html } = buildWelcomeEmail({
      email,
      password: input.password,
      companyName: company.name,
      roleLabel: input.role === "COMPANY_ADMIN" ? "Company Admin" : "Company User",
      invitedBy: await callerEmail(),
    });
    const emailResult = await sendEmail({ to: email, subject, html });

    revalidatePath("/dashboard/team");
    return { success: true, emailSent: emailResult.sent, emailError: emailResult.error };
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
