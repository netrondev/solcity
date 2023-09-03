import { signIn, useSession } from "next-auth/react";
import Button from "~/components/Button";
import { AdminCheck } from "~/components/Layout";
import { api } from "~/utils/api";

export default function TestAuth() {
  const authdata = api.auth.listdata.useQuery();
  const clear = api.auth.clearauth.useMutation();

  const session = useSession();

  return (
    <AdminCheck>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <hr />
      TEST AUTH
      <Button
        onClick={() => {
          clear.mutate();
        }}
      >
        CLEAR
      </Button>
      <Button
        onClick={() => {
          signIn().catch(console.error);
        }}
      >
        SIGNIN
      </Button>
      <div className="flex">
        <pre>{JSON.stringify(authdata, null, 2)}</pre>
        <pre>{JSON.stringify(clear, null, 2)}</pre>
      </div>
    </AdminCheck>
  );
}
