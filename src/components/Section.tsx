import { type ReactNode } from "react";
import { cn } from "~/utils/cn";

export function Section(props: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "gap-sm flex flex-col gap-2 rounded border",
        "bg-neutral-300 p-2 dark:border-neutral-700/50 dark:bg-neutral-700/10",
        props.className
      )}
    >
      {props.children}
    </section>
  );
}
