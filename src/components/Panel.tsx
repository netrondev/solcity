import { type ReactNode } from "react";

export function Panel(props: { children: ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border bg-white p-5 shadow-xl">
      {props.children}
    </section>
  );
}
