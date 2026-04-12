import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@productix/db";
import { authConfig } from "./auth.config";

const nextAuthResult = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || (!user.passwordHash && typeof credentials.password === "string")) {
          // If no user found or user has no passwordHash (needs reset because of migration),
          // we reject authentication.
          throw new Error("Invalid credentials or password reset required.");
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash!
        );

        if (passwordsMatch) {
          // Update last sign in time
          await prisma.user.update({
            where: { id: user.id },
            data: { lastSignInAt: new Date() }
          });
          
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
});

export const handlers = nextAuthResult.handlers;
export const auth = nextAuthResult.auth;
export const signIn = nextAuthResult.signIn as any;
export const signOut = nextAuthResult.signOut as any;
