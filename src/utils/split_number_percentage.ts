export function split_number_percentage(props: {
  inputnumber: number;
  percentage: number;
}): { left: number; right: number } {
  const left = props.inputnumber * (1 - props.percentage);
  const right = props.inputnumber - left;

  const result = {
    left,
    right,
  };
  return result;
}