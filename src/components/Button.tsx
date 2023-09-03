import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type ReactNode,
} from "react";
import { cn } from "~/utils/cn";
import Tooltip from "./Tooltip";
import Link from "next/link";

type ButtonEvent = Parameters<
  NonNullable<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >["onClick"]
  >
>[0];

export default function Button(
  props: {
    icon?: ReactNode;
    children?: ReactNode;
    href?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
    active?: boolean;
    tooltip?: string;
    onClick?: (e: ButtonEvent) => void | Promise<void>;
  } & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  const {
    icon,
    size,
    active: active,
    tooltip,
    className,
    href,
    ...rest
  } = props;

  function render_button() {
    return (
      <button
        {...rest}
        className={cn(
          "flex border font-normal tracking-wider text-neutral-600 transition dark:text-sky-400/70",
          size === "sm" && "gap-1 rounded px-2 py-1 text-sm",
          size === "md" || (!size && "gap-3 rounded-md p-1 px-2 font-normal"),
          size == "lg" && "gap-4 rounded-xl p-3",
          active
            ? "border-purple-300 bg-purple-700/10 text-purple-600"
            : cn(
                "bg-neutral-100 text-neutral-500 hover:bg-sky-200",
                "dark:border-sky-800 dark:bg-sky-950/50 hover:dark:border-sky-500 hover:dark:bg-sky-950 hover:dark:text-sky-200"
              ),
          // active === false && "opacity-90",

          className
        )}
      >
        {icon}
        {props.children}
      </button>
    );
  }

  if (href) {
    return <Link href={href}>{render_button()}</Link>;
  }

  if (tooltip) {
    return <Tooltip tooltip={tooltip}>{render_button()}</Tooltip>;
  }

  return <div>{render_button()}</div>;
}
