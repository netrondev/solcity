export function Heading(props: { children: string }) {
  return (
    <h1 className="text-xl font-semibold uppercase text-emerald-400">
      {props.children}
    </h1>
  );
}
