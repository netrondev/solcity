import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { Heading } from "~/components/Heading";

import Surreal from "surrealdb.js";
import {
  type QueryResult,
  type RawQueryResult,
} from "surrealdb.js/script/types";
import { env } from "~/env.mjs";

async function getToken(sessionToken: string) {
  const r = (await fetch(`${env.NEXT_PUBLIC_SURREALDB_HOST}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      NS: env.NEXT_PUBLIC_SURREALDB_NS,
      DB: env.NEXT_PUBLIC_SURREALDB_DB,
      SC: "account",
      pass: sessionToken,
    }),
  }).then((r) => r.json())) as unknown as {
    code: number;
    details: string;
    token: string;
  };
  console.log(r);
  //   const data = await r.json();
  //   resultSet(data);
  //   if (data.token) {
  //     localStorage.setItem("token", data.token);
  //     tokenSet(data.token);
  //   }
  return r;
}

async function dbQuery(token: string, query: string) {
  const r = (await fetch(`${env.NEXT_PUBLIC_SURREALDB_HOST}/sql`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      NS: env.NEXT_PUBLIC_SURREALDB_NS,
      DB: env.NEXT_PUBLIC_SURREALDB_DB,
    },
    body: query,
  }).then((r) => r.json())) as unknown;

  console.log(r);

  return r;
}

function useSrdb(props: { query: string }) {
  const session = useSession();
  const [conn, setConn] = useState<Surreal>();
  const [result, setResult] = useState<QueryResult<RawQueryResult>[]>();

  useEffect(() => {
    if (!session.data?.user.sessionToken) return;
    if (conn) return;

    const doconnect = async () => {
      const db = new Surreal();
      db.connect(`${env.NEXT_PUBLIC_SURREALDB_HOST}/sql`);

      await db.signin({
        NS: env.NEXT_PUBLIC_SURREALDB_NS,
        DB: env.NEXT_PUBLIC_SURREALDB_DB,
        pass: session.data?.user.sessionToken,
        SC: "account",
      });

      const data = await db.query(props.query);

      db.live("public", (onlive) => {
        console.log("live data:", onlive);
      }).catch(console.error);

      console.log(data);

      setResult(data);
      setConn(db);
    };

    doconnect().catch(console.error);
  }, [session.data?.user.sessionToken, conn]);

  return result;
}

export default function ScopeTest() {
  const session = useSession();

  const [token, setToken] = useState<string>();

  const srd = useSrdb({ query: `SELECT * FROM public;` });

  if (session.status != "authenticated") return <div></div>;
  if (!session.data.user.is_admin) return <div>auth..</div>;

  return (
    <div>
      <Heading>Scope test</Heading>
      <pre>{JSON.stringify({ session }, null, 2)}</pre>

      <Button
        onClick={() => {
          getToken(session.data?.user.sessionToken)
            .then((r) => {
              setToken(r.token);
            })
            .catch(console.error);
        }}
      >
        SIGNIN
      </Button>

      <pre>{JSON.stringify({ token }, null, 2)}</pre>

      <Button
        onClick={() => {
          if (!token) return;
          //   dbQuery(token, "SELECT * FROM session;").catch(console.error);
          dbQuery(
            token,
            `CREATE public SET newvalue = ${Math.random()};`
          ).catch(console.error);
        }}
      >
        TEST PUBLIC CREATE
      </Button>

      <Button
        onClick={() => {
          if (!token) return;
          //   dbQuery(token, "SELECT * FROM session;").catch(console.error);
          dbQuery(
            token,
            `CREATE private SET newvalue = ${Math.random()};`
          ).catch(console.error);
        }}
      >
        TEST PRIVATE CREATE
      </Button>

      <pre>{JSON.stringify(srd, null, 2)}</pre>

      <pre>{JSON.stringify(env.NEXT_PUBLIC_SURREALDB_HOST, null, 2)}</pre>
    </div>
  );
}
