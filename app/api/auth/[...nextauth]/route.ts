import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { db } from "../../../db";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    }),
  ],
});

export { handler as GET, handler as POST };
