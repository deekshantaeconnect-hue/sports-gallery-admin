import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials, req) {
        // This should hit your NestJS /users/check-admin or login endpoint
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-admin?email=${credentials?.email}`, {
          method: 'GET',
          headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json();

        if (res.ok && data.isStoreManager && data.accessToken) {
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.accessToken,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        // Optional: Add token expiry time from your backend if available
        // token.accessTokenExpires = Date.now() + 15 * 60 * 1000; 
      }
      
      // Note: If your backend access token expires, you must implement
      // the refresh logic right here in the JWT callback to fetch a new
      // access token from NestJS and update `token.accessToken`.
      return token;
    },
    async session({ session, token }) {
      // Expose the access token and role to the client-side NextAuth session
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };