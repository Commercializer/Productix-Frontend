"use server";

import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@productix/db";

export async function loginAction(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    // NextAuth v5 in server actions may throw NEXT_REDIRECT internally.
    // We must re-throw it so Next.js handles it properly, not swallow it.
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid credentials or password reset required." };
      }
      return { error: error.message };
    }
    return { error: "Authentication failed." };
  }

  // If we reach here, signIn succeeded. Now determine the correct redirect
  // target based on the user's role by reading the fresh session.
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;

  let redirectTo = "/dashboard";
  if (role === "SUPER_ADMIN") {
    redirectTo = "/admin";
  }
  // TENANT_ADMIN, COMPANY_ADMIN and COMPANY_USER → /dashboard (default)

  return { success: true, redirectTo };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
