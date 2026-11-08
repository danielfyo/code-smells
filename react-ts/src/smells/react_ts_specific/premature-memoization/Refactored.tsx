import { useState } from "react";

// REFACTOR: unnecessary memoization is removed. Cheap computations happen during render,
// handlers are plain functions and the component is a simple function.
// Memoization is added only when a profiler shows a real problem.
function Label({ text }: { text: string }) {
  return <span>{text}</span>;
}

export function TipCalculator() {
  const [bill, setBill] = useState(50);
  const [tipPercent, setTipPercent] = useState(10);

  const total = bill + (bill * tipPercent) / 100;

  return (
    <div>
      <input aria-label="Bill" type="number" value={bill} onChange={(e) => setBill(Number(e.target.value))} />
      <input
        aria-label="Tip %"
        type="number"
        value={tipPercent}
        onChange={(e) => setTipPercent(Number(e.target.value))}
      />
      <Label text={`Total: ${total.toFixed(2)} €`} />
    </div>
  );
}
