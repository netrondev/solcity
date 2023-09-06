import { Section } from "~/components/Section";
import { DepositScreen } from "./Deposit";
import { WithdrawScreen } from "./Withdraw";

export function Wallet() {
  return (
    <Section>
      <DepositScreen />
      <WithdrawScreen />
    </Section>
  );
}
