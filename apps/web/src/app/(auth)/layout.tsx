import type { Metadata } from "next";
import "../../app/globals.css";

export const metadata: Metadata = {
  title: "Sign in | Productix",
  description: "Sign in to your Productix account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-bg" />
      <div className="auth-content">{children}</div>
    </div>
  );
}
