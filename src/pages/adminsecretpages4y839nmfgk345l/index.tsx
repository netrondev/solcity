import { api } from "~/utils/api";

export default function SecretAdminTests() {
  const test = api.surrealdb.test.useQuery();
  return (
    <div>
      tests
      <pre>{JSON.stringify(test, null, 2)}</pre>
    </div>
  );
}
