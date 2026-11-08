import { useEffect, useState } from "react";

// REFACTOR: each effect returns its cleanup function, which undoes exactly what the effect
// created. They are split into two effects because they are two independent subscriptions.
export function SessionTimer({ onTick }: { onTick?: (seconds: number) => void }) {
  const [seconds, setSeconds] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => {
        onTick?.(s + 1);
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onTick]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <p>
      Session: {seconds}s · Width: {width}px
    </p>
  );
}
