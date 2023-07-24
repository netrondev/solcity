import { type DetailedHTMLProps, type InputHTMLAttributes } from "react";

export function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return <input {...props} className="rounded-xl bg-white/20 p-2 text-lg " />;
}
