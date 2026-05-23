"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@productix/db";
import bcrypt from "bcryptjs";

// ── Dashboard Stats ──────────────────────────────────────────────

export async function getDashboardStatsAction() {
  const [totalUsers, totalPromptions] = await Promise.all([
    prisma.user.count(),
    prisma.productProfile.count(),
  ]);

  // Active users: signed in within last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeUsers = await prisma.user.count({
    where: {
      lastSignInAt: { gt: sevenDaysAgo }
    }
  });

  const publishedCount = await prisma.productProfile.count({
    where: { NOT: { redirectUrl: null } }
  });

  return {
    totalUsers,
    totalPromptions,
    activeUsers,
    publishedPromptions: publishedCount,
  };
}

// ── User Management ──────────────────────────────────────────────

export async function listAllUsersAction(search?: string) {
  const users = await prisma.user.findMany({
    where: search ? { email: { contains: search, mode: "insensitive" } } : undefined,
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastSignInAt: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    lastSignIn: u.lastSignInAt?.toISOString() ?? null,
  }));
}

export async function listUsersByCompanyAction() {
  // Pull every company with its admins + users (and user details).
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      businessUsername: true,
      maximumUsers: true,
      isActive: true,
      tenant: { select: { id: true, name: true } },
      admins: {
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
              lastSignInAt: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
              lastSignInAt: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Platform users not attached to a company: SUPER_ADMIN, TENANT_ADMIN, or
  // any user that somehow lacks a company link.
  const platformUsers = await prisma.user.findMany({
    where: {
      AND: [
        { companyAdmin: { is: null } },
        { companyUser: { is: null } },
      ],
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastSignInAt: true,
      tenantAdmin: { select: { tenant: { select: { id: true, name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const toUserRow = (u: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    lastSignInAt: Date | null;
  }) => ({
    id: u.id,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    lastSignIn: u.lastSignInAt?.toISOString() ?? null,
  });

  return {
    companies: companies.map((c) => ({
      id: c.id,
      name: c.name,
      businessUsername: c.businessUsername,
      maximumUsers: c.maximumUsers,
      isActive: c.isActive,
      tenantId: c.tenant.id,
      tenantName: c.tenant.name,
      admins: c.admins.map((a) => toUserRow(a.user)),
      users: c.users.map((m) => toUserRow(m.user)),
    })),
    platformUsers: platformUsers.map((u) => ({
      ...toUserRow(u),
      tenantName: u.tenantAdmin?.tenant?.name ?? null,
    })),
  };
}

export async function createUserAction(data: {
  email: string;
  password: string;
  role: string;
}) {
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    // We use nested writes or rely on the default Role enum via Prisma
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role as any,
        isActive: true,
      }
    });

    revalidatePath("/admin/users");
    return { userId: user.id };
  } catch (error: any) {
    // If unique constraint error
    if (error.code === 'P2002') {
      return { error: "Email already exists." };
    }
    return { error: error.message || "Failed to create user." };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    // Prisma Cascade delete will handle related models if properly setup in schema
    // We explicitly delete just in case
    await prisma.tenantAdmin.deleteMany({ where: { userId } });
    await prisma.companyAdmin.deleteMany({ where: { userId } });
    await prisma.companyUser.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete user." };
  }
}

export async function disableUserAction(userId: string, disable: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !disable }
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update user status." };
  }
}

export async function resetUserPasswordAction(
  userId: string,
  newPassword: string
) {
  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to reset password." };
  }
}

// ── Promptions (product_profiles) ───────────────────────────────

export async function listAllPromptionsAction(search?: string) {
  const promptions = await prisma.productProfile.findMany({
    where: search ? { productName: { contains: search, mode: "insensitive" } } : undefined,
    include: {
      product: {
        include: {
          company: {
            select: { name: true, businessUsername: true }
          }
        }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return promptions.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.productName,
    companyName: p.product?.company?.name ?? "-",
    businessUsername: p.product?.company?.businessUsername ?? "",
    updatedAt: p.updatedAt.toISOString(),
    createdAt: p.createdAt.toISOString(),
    shareUrl: `/preview/${p.slug}`,
  }));
}

export async function deletePromptionAction(id: string, isAdmin = true) {
  try {
    await prisma.productProfile.delete({
      where: { id }
    });

    revalidatePath("/admin/promptions");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete promption." };
  }
}

