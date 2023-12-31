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

export default function Button2(
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
          "flex whitespace-nowrap  font-bold tracking-wider text-white transition",
          size === "sm" && "gap-1 px-2 py-1 text-sm",
          size === "md" ||
            (!size && "gap-3 rounded-md p-1 px-2 text-sm font-semibold"),
          size == "lg" && "gap-4 rounded-xl p-3",
          active
            ? " text-white"
            : cn(
                " border border-white text-white dark:text-white",
                props.disabled
                  ? "opacity-50"
                  : "cursor-pointer border border-white hover:border-none hover:bg-blue-800"
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
