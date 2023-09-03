export function Heading(props: { children: string }) {
  return <h1 className="text-xl font-semibold uppercase">{props.children}</h1>;
}
