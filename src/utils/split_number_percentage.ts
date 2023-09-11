export function split_number_percentage(props: {
  inputnumber: number;
  /** 0 - 1 ratio */
  percentage: number;
  integer?: boolean;
}): { left: number; right: number } {
  if (props.integer) {
    if (Math.round(props.inputnumber) != props.inputnumber)
      throw new Error("expected integer input.");
  }

  let left = props.inputnumber * (1 - props.percentage);

  if (props.integer) {
    left = Math.round(left);
  }

  const right = props.inputnumber - left;

  const result = {
    left,
    right,
  };
  return result;
}
