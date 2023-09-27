import { useState } from "react";
import Button from "~/components/Button";
import { Input } from "~/components/Input";
import { Label } from "~/components/Label";
import { Section } from "~/components/Section";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

export function TokenMint() {
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSupply, setTokenSupply] = useState<number>(10000);

  const tokencreate = api.solana.token.create.useMutation();

  return (
    <Section className="flex flex-row">
      <div className="flex-1">
        <Label title="Token Name">
          <Input
            value={tokenName}
            onChange={(e) => {
              setTokenName(e.target.value);
              tokencreate.reset();
            }}
          />
        </Label>

        <Label title="Token Supply">
          <Input
            value={tokenSupply}
            type="number"
            placeholder="Token Name"
            onChange={(e) => {
              setTokenSupply(e.target.valueAsNumber);
            }}
          />
        </Label>
      </div>

      <Button
        className={cn(
          "h-full items-center justify-center self-stretch px-5",
          tokencreate.isError ? "bg-rose-600 hover:bg-rose-600" : ""
        )}
        onClick={() => {
          tokencreate.mutate({
            tokenName,
            tokenSupply,
          });
        }}
      >
        {tokencreate.isError ? tokencreate.error?.message : "Mint Tokens"}
      </Button>

      <pre>{JSON.stringify(tokencreate.data, null, 2)}</pre>
    </Section>
  );
}
