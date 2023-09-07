export function array_total(data: number[] | undefined | null): number {
  if (!data) return 0;
  if (data.length == 0) return 0;
  return data.reduce((a, b) => a + b);
}
