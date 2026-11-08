import { useEffect, useState } from "react";

// REFACTOR: use the functional form of setState (no need to read "count" from the closure)
// and declare every real dependency ([step]). The effect is rescheduled only when step
// changes and never reads stale values.
export function AutoCounter({ step = 1 }: { step?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((current) => current + step);
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  return <p>Visits: {count}</p>;
}
