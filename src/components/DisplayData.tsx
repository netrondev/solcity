export function DisplayData(props: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex flex-col rounded-xl bg-black/20 px-3 py-2">
      <label className="text-white/50">{props.label}</label>
      <span className="text-amber-500">
        {typeof props.value === "number" ? props.value.toFixed(9) : props.value}{" "}
        {props.unit}
      </span>
    </div>
  );
}
