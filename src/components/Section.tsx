import { type ReactNode } from "react";
import { cn } from "~/utils/cn";

export function Section(props: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-lg border",
        "bg-neutral-300 p-4 dark:border-neutral-700/50 dark:bg-neutral-700/30",
        props.className
      )}
    >
      {props.children}
    </section>
  );
}
