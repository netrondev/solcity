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
        "w-full rounded-xl bg-blue-900 p-2 outline outline-sky-500 ",
        props.className
      )}
    />
  );
}
