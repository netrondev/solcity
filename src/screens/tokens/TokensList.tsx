import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";

export function TokensList() {
  const tokenlist = api.solana.token.listTokens.useQuery();

  return (
    <Section>
      <Heading>Tokens List</Heading>

      <pre>{JSON.stringify(tokenlist.data, null, 2)}</pre>
    </Section>
  );
}
