import type { NextAuthConfig } from "next-auth";

export const authConfig = {
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
          let target = "/dashboard";
          if (role === "SUPER_ADMIN") target = "/admin";
          else if (role === "TENANT_ADMIN") target = "/tenant";
          return Response.redirect(new URL(target, nextUrl));
        }
        return true;
      }

      return true; // We manage route protection inside layout components directly, so we allow access to continue here.
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
