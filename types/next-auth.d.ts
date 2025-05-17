// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      username: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}
