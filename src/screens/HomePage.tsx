import { DrawCurrent } from "./DrawCurrent";

export function HomePage() {
  return (
    <div>
      <div>Notice of last draw result</div>

      <DrawCurrent />

      <div>How it works</div>

      <div>View past draws</div>

      <div>Footer</div>
    </div>
  );
}
