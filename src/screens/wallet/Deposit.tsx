import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import { SolanaPublicInfo } from "~/components/SolanaPublicInfo";
import { api } from "~/utils/api";

export function DepositScreen() {
  const account = api.solana.wallet.account.useQuery();

  return (
    <div className="relative isolate mx-auto  overflow-hidden bg-gray-900  pt-2 text-center shadow-2xl sm:rounded-3xl sm:px-16 sm:p-5">
      <Heading>Deposit</Heading>
      {account.data && <SolanaPublicInfo publicKey={account.data?.publicKey} />}
      <div
        className="absolute -top-24 right-0 -z-10 transform-gpu animate-pulse blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
    </div>
  );
}
