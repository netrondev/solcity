import { Section } from "~/components/Section";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";
import { api } from "~/utils/api";

export function DepositScreen() {
  const account = api.solana.wallet.account.useQuery();

  return (
    <Section>
      <h1>Deposit</h1>

      {account.data && (
        <>
          <SolanaPublicInfo publicKey={account.data?.publicKey} />
        </>
      )}
    </Section>
  );
}
