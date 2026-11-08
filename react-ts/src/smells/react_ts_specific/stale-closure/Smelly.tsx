import { useEffect, useState } from "react";

// SMELL: stale closure from omitted dependencies. The interval is created only once
// ([] as dependencies) and its callback "captures" the value of "count" from the first
// render (0). It always computes 0 + 1, so the counter gets stuck at 1.
// "step" is frozen too: changing it from outside has no effect.
export function AutoCounter({ step = 1 }: { step?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + step); // SMELL: reads count and step from the first render
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p>Visits: {count}</p>;
}
