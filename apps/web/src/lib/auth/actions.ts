"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function loginAction(email: string, password: string) {
  try {
    // Attempt sign in without throwing Next.js redirect from NextAuth
    // In Server Actions with Credentials, `redirect: false` is supported for Credentials.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    // In v5 beta, if redirect=false, it returns an error or success object
    if (result?.error) {
       return { error: "Authentication failed." };
    }

    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid credentials or password reset required." };
      }
      return { error: error.message };
    }
    // If it's a redirect error from next.js, we catch it but signIn w/ redirect: false doesn't throw
    return { error: "Authentication failed." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
