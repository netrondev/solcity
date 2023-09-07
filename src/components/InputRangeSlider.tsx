import { useEffect, useRef, useState } from "react";

export function InputRangeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [enabled, setEnabled] = useState(false);
  const [width, setWidth] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const left = width * value - 12;

  useEffect(() => {
    if (elementRef.current) {
      setWidth(elementRef.current.offsetWidth);
      setOffsetLeft(elementRef.current.offsetLeft);
    }
  }, []);

  return (
    <>
      <div className="relative h-10" ref={elementRef}>
        {/* DOT */}
        <div
          className="absolute -top-2 h-6 w-6 cursor-pointer rounded-full bg-emerald-500 transition hover:bg-emerald-300"
          style={{
            left,
          }}
          onMouseDown={() => {
            setEnabled(true);
          }}
          onMouseUp={() => {
            setEnabled(false);
          }}
          onMouseMove={(e) => {
            if (!enabled) return;

            e.preventDefault();
            if (e.clientX === 0) {
              return;
            }

            // calculate percentage
            let perc = (e.clientX - offsetLeft) / width;
            if (perc < 0) perc = 0;
            if (perc > 1) perc = 1;

            onChange(perc);

            e.stopPropagation();
          }}
        />

        {/* BACKGROUND SLOT */}
        <div className="h-2 w-full overflow-hidden rounded bg-neutral-300 dark:bg-neutral-950">
          <div
            className="h-full bg-emerald-600"
            style={{
              width: `${(value * 100).toFixed(3)}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}
