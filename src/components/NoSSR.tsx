import { useState, type ReactNode, useEffect } from "react";

export function NoSSR(props: { children: ReactNode }) {
  const [load, load_set] = useState(false);

  useEffect(() => {
    if (!load) load_set(true);
  }, [load]);

  if (!load) return <></>;

  return <>{props.children}</>;
}
