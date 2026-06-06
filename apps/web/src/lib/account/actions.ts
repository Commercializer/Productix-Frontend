"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@productix/db";
import { auth } from "@/auth";

/**
 * Let the currently signed-in user change their own password.
 * Available to every authenticated user regardless of role.
 */
export async function changePasswordAction(currentPassword: string, newPassword: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    return { error: "You must be signed in to change your password." };
  }

  if (!currentPassword || !newPassword) {
    return { error: "Both your current and new password are required." };
  }
  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword === currentPassword) {
    return { error: "New password must be different from your current password." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });
  if (!user?.passwordHash) {
    return { error: "Your account has no password set. Contact an administrator." };
  }

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    return { error: "Your current password is incorrect." };
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { success: true };
  } catch (error: any) {
    return { error: error?.message ?? "Failed to update password." };
  }
}
