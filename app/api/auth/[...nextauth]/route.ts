import { compare } from "bcryptjs";
import prisma from "@/lib/prisma"; // sesuaikan pathnya
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });

        if (!user) {
          return null;
        }

        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // halaman login
    signOut: "/auth/logout", // kalau kamu punya logout page
    error: "/auth/login", // kalau error redirect ke login
    newUser: "/dashboard", // saat user baru dibuat (tidak selalu terpakai)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (typeof token.role === "string") {
        session.user.role = token.role;
      }
      if (typeof token.username === "string") {
        session.user.username = token.username; // ✅ Tambahkan ini
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
