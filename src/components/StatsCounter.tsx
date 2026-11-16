import { useEffect, useState } from "react";
import { useStats } from "../hooks/useStats";
import "./StatsCounter.css";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function OdometerDigit({ digit }: { digit: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(digit));
    return () => cancelAnimationFrame(frame);
  }, [digit]);

  return (
    <span className="odometer__digit">
      <span
        className="odometer__reel"
        style={{ transform: `translateY(${-shown * 10}%)` }}
      >
        {DIGITS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

function Odometer({ value }: { value: number }) {
  const chars = value.toLocaleString().split("");

  return (
    <span className="odometer">
      {chars.map((char, i) => {
        const positionFromRight = chars.length - i;
        if (!/\d/.test(char)) {
          return (
            <span key={`sep-${positionFromRight}`} className="odometer__sep">
              {char}
            </span>
          );
        }
        return (
          <OdometerDigit key={`digit-${positionFromRight}`} digit={Number(char)} />
        );
      })}
    </span>
  );
}

export function StatsCounter() {
  const { count } = useStats();
  const label =
    count === 1 ? "QR code downloaded" : "QR codes downloaded";

  return (
    <p className="stats-counter">
      <span className="stats-counter__value" aria-hidden="true">
        <Odometer value={count} />
      </span>
      <span className="stats-counter__label" aria-hidden="true">
        {label}
      </span>
      <span className="visually-hidden" aria-live="polite">
        {count.toLocaleString()} {label}
      </span>
    </p>
  );
}
