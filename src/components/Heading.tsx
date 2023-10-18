export function Heading(props: { children: string }) {
  return (
    <h1 className="text-2xl font-semibold uppercase text-blue-700 dark:text-blue-400">
      {props.children}
    </h1>
  );
}
