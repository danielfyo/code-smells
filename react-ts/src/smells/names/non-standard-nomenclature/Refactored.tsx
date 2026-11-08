import { useState } from "react";

// REFACTOR: follow the ecosystem's standard conventions:
// PascalCase components, "use" prefix for hooks, camelCase props,
// "onX" callbacks in the public API and "handleX" for internal handlers.
interface QuantityCounterProps {
  initialValue: number;
  onChange?: (value: number) => void;
}

export function useCounter(initialValue: number) {
  const [value, setValue] = useState(initialValue);
  return { value, increment: () => setValue((v) => v + 1) };
}

export function QuantityCounter({ initialValue, onChange }: QuantityCounterProps) {
  const counter = useCounter(initialValue);
  const handleClick = () => {
    counter.increment();
    onChange?.(counter.value + 1);
  };
  return <button onClick={handleClick}>Units: {counter.value}</button>;
}
