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
        "rounded border-none bg-black p-1 px-2 focus:outline-none",
        props.className
      )}
    />
  );
}
