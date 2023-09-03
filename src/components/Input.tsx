import { type InputHTMLAttributes, type DetailedHTMLProps } from "react";
import { cn } from "~/utils/cn";

export function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return (
    <input
      {...props}
      className={cn(
        "rounded border-none p-2 focus:outline-none dark:bg-neutral-900",
        props.className
      )}
    />
  );
}
