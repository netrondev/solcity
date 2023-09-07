export function PotDisplay(props: { pot_total: number }) {
  return (
    <div className="rounded-xl bg-black/20 p-5 text-2xl text-white">
      {props.pot_total.toLocaleString("en-US", {
        minimumFractionDigits: 7,
        maximumFractionDigits: 7,
      })}
      &nbsp; SOL
    </div>
  );
}
