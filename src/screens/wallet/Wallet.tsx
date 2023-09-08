import { Section } from "~/components/Section";
import { DepositScreen } from "./Deposit";
import { WithdrawScreen } from "./Withdraw";
import { TransactionHistory } from "./TransactionHistory";

export function Wallet() {
  return (
    <Section>
      <DepositScreen />
      <WithdrawScreen />
      <TransactionHistory />
    </Section>
  );
}
