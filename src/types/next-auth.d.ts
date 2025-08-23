import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"]; // name, email, image залишаються
  }

  interface User {
    id: string;
    role?: string;
  }

  interface JWT {
    id: string;
    role?: string;
  }
}