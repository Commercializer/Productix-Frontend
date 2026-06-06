"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  useCallback,
} from "react";
import { SessionProvider, useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface AuthUser {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "TENANT_ADMIN" | "COMPANY_ADMIN" | "COMPANY_USER";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean; // Deprecating soon, keeping for backward compatibility in components
  isSuperAdmin: boolean;
  isTenantAdmin: boolean;
  isCompanyAdmin: boolean;
  isCompanyUser: boolean;
  /** Can manage a company's dashboard with admin privileges (company OR tenant admin). */
  isCompanyManager: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  isTenantAdmin: false,
  isCompanyAdmin: false,
  isCompanyUser: false,
  isCompanyManager: false,
  signOut: async () => {},
});

function AuthStateManager({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const loading = status === "loading";
  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id as string,
        email: session.user.email as string,
        role: (session.user as any).role as AuthUser["role"],
      }
    : null;

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ callbackUrl: "/login" });
  }, []);

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "TENANT_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const isTenantAdmin = user?.role === "TENANT_ADMIN";
  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const isCompanyUser = user?.role === "COMPANY_USER";
  // Tenant admins act as company admins on the dashboard.
  const isCompanyManager = isCompanyAdmin || isTenantAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isSuperAdmin,
        isTenantAdmin,
        isCompanyAdmin,
        isCompanyUser,
        isCompanyManager,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateManager>{children}</AuthStateManager>
    </SessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
