import Link from "next/link";
import { DrawCurrent } from "./DrawCurrent";
import Image from "next/image";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import Button from "~/components/Button";
import { DrawHistory } from "./DrawHistory";
import { Disclosure } from "@headlessui/react";
// import FooterNav from "~/components/footer";

export function HomePage() {
  return (
    <div className="flex flex-col gap-5 bg-gray-50 dark:bg-neutral-950">
      <DrawCurrent />

      <Section className="gap-4">
        <Heading>How it works</Heading>

        <p className="text-xs">
          This is a SOLANA lottery game built during the 2023 Solana Hyperdrive
          hackathon. DISCLAIMER: THIS IS EARLY BETA SOFTWARE. USE AT OWN RISK.
        </p>

        <div className="flex  bg-black ">
          <Link href="https://solana.com/hyperdrive" className="flex-1">
            <Image
              src="/hyperdrive.png"
              width={2000}
              height={2000}
              alt="hyperdrive"
              className="object-cover opacity-80 transition hover:opacity-100"
            />
          </Link>
        </div>
      </Section>
      {/* <FooterNav /> */}
    </div>
  );
}
