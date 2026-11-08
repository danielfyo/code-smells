import { useEffect, useState } from "react";

// SMELL: effect without cleanup. The interval and the "resize" listener are never removed:
// after unmounting they stay alive (memory leak, setState on an unmounted component)
// and every mount adds another one.
export function SessionTimer({ onTick }: { onTick?: (seconds: number) => void }) {
  const [seconds, setSeconds] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    setInterval(() => {
      setSeconds((s) => {
        onTick?.(s + 1);
        return s + 1;
      });
    }, 1000);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, [onTick]);

  return (
    <p>
      Session: {seconds}s · Width: {width}px
    </p>
  );
}
