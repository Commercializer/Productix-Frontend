import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      
      if (isOnLogin) {
        if (isLoggedIn) {
          const role = (auth?.user as any)?.role as string | undefined;
          // TENANT_ADMIN acts as a company admin and lives on /dashboard.
          let target = "/dashboard";
          if (role === "SUPER_ADMIN") target = "/admin";
          return Response.redirect(new URL(target, nextUrl));
        }
        return true;
      }

      return true; // We manage route protection inside layout components directly, so we allow access to continue here.
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
