import chalk from "chalk";
import { type Adapter } from "next-auth/adapters";
import { getDB } from "./db";
import { z } from "zod";

// https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript
// type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

const AdapterUserZod = z.object({
  id: z.string(),
  name: z.string(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().optional(),
  email: z.string(),
});

const AdapterAccountZod = z.object({
  access_token: z.string(),
  expires_at: z.number(),
  userId: z.string(),
  id: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string(),
  scope: z.string(),
  provider: z.string(),
  token_type: z.string(),
  type: z.union([
    z.literal("oauth"),
    z.literal("email"),
    z.literal("credentials"),
  ]),
});

const AdapaterSessionZod = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
});

const VerificationTokenZod = z.object({
  // id: z.string(),
  identifier: z.string(),
  expires: z.date(),
  token: z.string(),
});

/** unwraps surreal response array to return a single typed result */
function queryParse<T>(data: unknown, parser: z.ZodType<T>) {
  const res = z.array(
    z.object({
      result: z.array(parser),
    })
  );
  const p = res.parse(data);

  const output = p.at(0)?.result.at(0);

  if (!output) return null;

  const out = parser.parse(output);
  return out;
}

export function SurrealAdapter(): Adapter {
  return {
    async createUser(data) {
      console.log(chalk.cyan("SurrealAdapter", "createUser", data.email));
      const client = await getDB();
      const userCreated = await client.create("user", data);
      const output = userCreated[0]!;

      return output;
    },
    async getUser(id) {
      console.log(chalk.cyan("SurrealAdapter", "getUser", id));
      const client = await getDB();
      const data = await client.query(`SELECT * FROM user:${id};`); //.findUnique<AdapterUser>
      const user = queryParse(data, AdapterUserZod);
      return user;
    },
    async getUserByEmail(email) {
      console.log(chalk.cyan("SurrealAdapter", "getUserByEmail", email));
      const client = await getDB();
      const data = await client.query(
        `SELECT * FROM user WHERE email = "${email}" LIMIT 1;`
      );
      const user = queryParse(data, AdapterUserZod);
      return user;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      console.log(
        chalk.cyan(
          "SurrealAdapter",
          "getUserByAccount",
          providerAccountId,
          provider
        )
      );

      const client = await getDB();

      // CLEAR AUTH DB

      const account_data = await client.query(
        `SELECT * FROM account WHERE providerAccountId = "${providerAccountId}" LIMIT 1;`
      );
      const account = queryParse(account_data, AdapterAccountZod);
      if (!account) return null;
      const user_data = await client.query(
        `SELECT * FROM user WHERE id = ${account.userId} LIMIT 1;`
      );
      const user = queryParse(user_data, AdapterUserZod);
      return user;
    },
    async updateUser(user) {
      console.log(chalk.cyan("SurrealAdapter", "updateUser", user.email));
      const { id, ...data } = user;
      const client = await getDB();
      const updated_user_data = await client.query(
        `UPDATE user:${id} CONTENT ${JSON.stringify(data)};`
      );
      const user_updated = queryParse(updated_user_data, AdapterUserZod);

      if (!user_updated) throw new Error("Could not update user account");

      return user_updated;
    },
    async deleteUser(id) {
      console.log(chalk.cyan("SurrealAdapter", "deleteUser", id));
      const client = await getDB();
      await client.query(`DELETE user:${id};`);
      return;
    },
    async linkAccount(data) {
      console.log(chalk.cyan("SurrealAdapter", "linkAccount", data.userId));
      // return await client.create("account", { data });
      const client = await getDB();
      const account_data = await client.query(
        `CREATE account CONTENT ${JSON.stringify(data)};`
      );
      const account = queryParse(account_data, AdapterAccountZod);

      if (!account) throw new Error("Could not link account");

      return account;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      console.log(
        chalk.cyan(
          "SurrealAdapter",
          "unlinkAccount",
          providerAccountId,
          provider
        )
      );

      // return await client.delete<AdapterAccount & { id?: string }>("account", {
      //   where: { providerAccountId },
      // });
      const client = await getDB();

      const delete_account_data = await client.query(
        `DELETE account WHERE providerAccountId = "${providerAccountId}";`
      );
      const account_deleted = queryParse(
        delete_account_data,
        AdapterAccountZod
      );

      if (!account_deleted) throw new Error("Could not delete account");

      return account_deleted;
    },
    async createSession(data) {
      console.log(chalk.cyan("SurrealAdapter", "createSession", data.userId));

      const client = await getDB();
      const session_data = await client.query(
        `CREATE session CONTENT ${JSON.stringify(data)};`
      );
      const session = queryParse(session_data, AdapaterSessionZod);

      if (!session) {
        console.log(chalk.red("No session data."));
        throw new Error("Could not create session");
      }

      session.expires = new Date(session.expires);

      return session;
    },
    async getSessionAndUser(sessionToken) {
      console.log(chalk.cyan("SurrealAdapter", "getSessionAndUser"));

      const client = await getDB();
      // await client.query(`REMOVE DATABASE ${env.SURREALDB_DB};`);
      const session_data = await client.query(
        `SELECT * FROM session WHERE sessionToken = "${sessionToken}";`
      );

      const session = queryParse(session_data, AdapaterSessionZod);

      if (!session) {
        console.log(chalk.red("No session data."));
        return null;
      }

      // const session = await client.findUnique<AdapterSession & { id?: string }>(
      //   "session",
      //   { where: { sessionToken } }
      // );

      // session.expires = new Date(session.expires);

      // const user = await client.findUnique<AdapterUser>("user", {
      //   where: { id: session.userId },
      // });

      const user_data = await client.query(`SELECT * FROM ${session.userId};`);

      const user = queryParse(user_data, AdapterUserZod);
      if (!user) return null;

      console.log("User activity ", user.email);

      return { user, session };
    },
    async updateSession(data) {
      console.log(chalk.cyan("SurrealAdapter", "updateSession"));
      const client = await getDB();
      data.sessionToken;
      const session_data = await client.query(
        `UPDATE session SET expires = "${data.expires?.toISOString()}" WHERE sessionToken = "${
          data.sessionToken
        }";`
      );

      // const session = await client.update<AdapterSession & { id?: string }>(
      //   "session",
      //   {
      //     where: { sessionToken: data.sessionToken },
      //     data,
      //   }
      // );
      const session = queryParse(session_data, AdapaterSessionZod);
      // session.expires = new Date(session.expires);
      return session;
    },
    async deleteSession(sessionToken) {
      console.log(chalk.cyan("SurrealAdapter", "deleteSession"));

      const client = await getDB();
      const delete_session_data = await client.query(
        `DELETE session WHERE sessionToken = "${sessionToken}";`
      );

      const delete_session = queryParse(
        delete_session_data,
        AdapaterSessionZod
      );

      return delete_session;

      // return await client.delete<AdapterSession & { id?: string }>("session", {
      //   where: { sessionToken },
      // });
    },
    async createVerificationToken(data) {
      console.log(
        chalk.cyan("SurrealAdapter", "createVerificationToken", data.identifier)
      );
      const client = await getDB();

      const verification_token_data = await client.query(
        `CREATE verificationToken CONTENT ${JSON.stringify(data)};`
      );

      const verification_token = queryParse(
        verification_token_data,
        VerificationTokenZod
      );

      // const verificationToken = await client.create<VerificationToken>(
      //   "verificationToken",
      //   { data }
      // );
      // const { id, ...vtoken } = verification_token;
      // const vtokentyped: VerificationToken = vtoken;
      return verification_token;
    },
    async useVerificationToken({ identifier, token }) {
      console.log(
        chalk.cyan("SurrealAdapter", "useVerificationToken", identifier)
      );
      try {
        const client = await getDB();
        const verification_token_data = await client.query(
          `DELETE verificationToken WHERE identifier = ${identifier} AND token = ${token};`
        );
        const verification_token = queryParse(
          verification_token_data,
          VerificationTokenZod
        );
        // const verificationToken = await client.delete<
        //   VerificationToken & { id?: string }
        // >("verificationToken", {
        //   where: { identifier, token },
        // });
        // const { id, ...vtoken } = verificationToken;
        // const vtokentyped: VerificationToken = vtoken;
        return verification_token;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.p....io/docs/reference/api-reference/error-reference#p2025
        // if ((error as p...ClientKnownRequestError).code === "P2025")
        //   return null

        throw error;
      }
    },
  };
}
