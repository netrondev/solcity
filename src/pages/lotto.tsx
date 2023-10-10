import Link from "next/link";
import { DrawCurrent } from "../screens/DrawCurrent";
import Image from "next/image";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import Button from "~/components/Button";
import { DrawHistory } from "../screens/DrawHistory";
import { HowItWorks } from "../screens/HowItWorks";

export default function LottoPage() {
  return (
    <div className="flex flex-col gap-5 bg-gray-50 dark:bg-neutral-950">
      <DrawCurrent />
      <HowItWorks />
    </div>
  );
}
