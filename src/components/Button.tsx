import { type DetailedHTMLProps, type ButtonHTMLAttributes } from "react";

export function Button(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return (
    <button
      {...props}
      className="rounded-xl bg-amber-500 p-2 text-lg font-bold text-black"
    />
  );
}
