import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PlatformType, db } from "../../../db";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // opt-in to Twitter OAuth 2.0
      authorization: {
        params: {
          scope: "tweet.read tweet.write users.read",
        },
      },
      profile(profile) {
        return {
          id: profile.data.id,
          username: "<X>" + profile.data.username.toLowerCase(),
          ui_username: "<X>" + profile.data.username,
          name: profile.data.name ?? profile.data.username,
          email: null,
          image: profile.data.profile_image_url ?? "",
          created_at: new Date().toISOString(),
          platform: PlatformType.X,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
