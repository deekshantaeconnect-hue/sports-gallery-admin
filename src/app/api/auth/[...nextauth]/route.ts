// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import setCookieParser from "set-cookie-parser";

const MAX_AGE_DAYS = parseInt(
  process.env.REFRESH_TOKEN_MAX_AGE_DAYS || "7",
  10,
);
const COOKIE_MAX_AGE_SECONDS = MAX_AGE_DAYS * 24 * 60 * 60;

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            },
          );

          const setCookieHeader = res.headers.get("set-cookie");
          if (setCookieHeader) {
            const parsedCookies = setCookieParser.parse(setCookieHeader, {
              map: true,
            });
            const cookieStore = await cookies();

            const cookieEntries = [
              { name: "refresh_token", cookie: parsedCookies.refresh_token },
              { name: "device_id", cookie: parsedCookies.device_id },
            ];

            for (const { name, cookie } of cookieEntries) {
              if (!cookie?.value) continue;

              cookieStore.set({
                name,
                value: cookie.value,
                httpOnly: cookie.httpOnly ?? true,
                secure: cookie.secure ?? process.env.NODE_ENV === "production",
                sameSite: (cookie.sameSite as any) ?? "lax",
                path: cookie.path ?? "/",
                maxAge: cookie.maxAge ?? COOKIE_MAX_AGE_SECONDS,
              });
            }
          }

          const data = await res.json();
          
          if (res.ok && data.user?.role === "STORE_MANAGER") {
            return { 
              ...data.user, 
              accessToken: data.access_token,
              id: data.user.id,
            };
          }
          
          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken ?? token.accessToken;
        token.id = user.id ?? token.id;
      }

      if (token.accessToken === undefined) {
        token.accessToken = null;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      session.accessToken = token.accessToken ?? null;
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };