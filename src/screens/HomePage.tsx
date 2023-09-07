import Link from "next/link";
import { DrawCurrent } from "./DrawCurrent";
import Image from "next/image";
import { Heading } from "~/components/Heading";
import { Section } from "~/components/Section";
import Button from "~/components/Button";
import { HowItWorks } from "./HowItWorks";

export function HomePage() {
  return (
    <div className="flex flex-col gap-5 bg-gray-50 dark:bg-neutral-950">
      <DrawCurrent />
      <HowItWorks />
    </div>
  );
}
