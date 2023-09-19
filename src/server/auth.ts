import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { SurrealAdapter } from "./surrealdb_nextauth_adapter";
import { GetPublicKeyForUser } from "./api/routers/solana/GetPublicKeyForUser";
import { adminusers } from "./adminusers";
import { getDB } from "./db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      is_admin?: boolean;
      publicKey: string;
      sessionToken: string;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async (props) => {
      const { session } = props;

      const pub = await GetPublicKeyForUser({ user_id: props.user.id });

      const db = await getDB();
      const user = await db
        .query<[{ sessionToken: string }]>(
          `SELECT * FROM ONLY session WHERE userId = "${props.user.id}" ORDER BY expires DESC LIMIT 1;`
        )
        .then((d) => d.at(0)!.result);

      if (!user) throw new Error("Could not find sessionToken");

      return {
        ...session,
        user: {
          ...session.user,
          id: props.user.id,
          publicKey: pub.publicKey,
          is_admin: session.user.email
            ? adminusers.includes(session.user.email)
            : undefined,
          sessionToken: user.sessionToken,
        },
      };
    },
  },
  adapter: SurrealAdapter(),
  providers: [
    // Todo add Solana Wallet: https://www.quicknode.com/guides/solana-development/dapps/how-to-authenticate-users-with-a-solana-wallet
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
