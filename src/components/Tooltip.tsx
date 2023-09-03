import { useState, type ReactNode } from "react";
import { cn } from "~/utils/cn";

export default function Tooltip(props: {
  children: ReactNode;
  tooltip: string;
}) {
  const [hover, hover_set] = useState(false);
  const [aligned_to, aligned_to_set] = useState<"left" | "right">("left");
  return (
    <div
      onMouseEnter={(ev) => {
        if (window) {
          aligned_to_set(
            window.innerWidth - ev.clientX < 200 ? "right" : "left"
          );
        }
        hover_set(true);
      }}
      onMouseLeave={() => {
        hover_set(false);
      }}
      className="relative"
    >
      {props.children}

      <div
        className={cn(
          "absolute -top-6 z-50 select-none rounded border bg-white px-2 py-0.5 text-neutral-600 shadow-xl transition",
          hover ? "opacity-100" : "opacity-0",
          aligned_to === "left" && "left-0",
          aligned_to === "right" && "right-0"
        )}
      >
        <div className="whitespace-nowrap font-sans text-xs  font-normal normal-case">
          {props.tooltip}
        </div>
      </div>
    </div>
  );
}
