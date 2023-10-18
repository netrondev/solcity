import { type ReactNode } from "react";
import { cn } from "~/utils/cn";

export function Section(props: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "gap-sm flex flex-col gap-2 rounded ",
        "p-2 shadow-lg  dark:shadow-none",
        props.className
      )}
    >
      {props.children}
    </section>
  );
}
