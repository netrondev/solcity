import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

export function TokenMintList() {
  const mints = api.solana.token.list_mints_for_user.useQuery();
  return (
    <Section>
      <Heading>Token Mint List</Heading>

      <pre>{JSON.stringify(mints.data, null, 2)}</pre>
    </Section>
  );
}
