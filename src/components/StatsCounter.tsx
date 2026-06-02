import { useStats } from "../hooks/useStats";
import "./StatsCounter.css";

export function StatsCounter() {
  const { count } = useStats();

  if (count === null) {
    return null;
  }

  return (
    <p className="stats-counter" aria-live="polite">
      <span className="stats-counter__emoji" aria-hidden="true">
        🎉
      </span>
      <span className="stats-counter__value">{count.toLocaleString()}</span>
      <span className="stats-counter__label">qr codes downloaded</span>
    </p>
  );
}
