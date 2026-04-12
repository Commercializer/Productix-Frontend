import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Productix",
  description: "Sign in to your Productix account to manage your promptions.",
};

export default function LoginPage() {
  return <LoginForm />;
}
