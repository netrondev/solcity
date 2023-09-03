import Surreal from "surrealdb.js";
import { env } from "~/env.mjs";

export async function getDB(): Promise<Surreal> {
  const surrealdb: Surreal = new Surreal(`${env.SURREALDB_HOST}/rpc`);
  await surrealdb.signin({
    user: env.SURREALDB_USER,
    pass: env.SURREALDB_PASS,
  });
  await surrealdb.use({ ns: env.SURREALDB_NS, db: env.SURREALDB_DB });
  return surrealdb;
}
