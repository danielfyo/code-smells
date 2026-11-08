import { memo, useCallback, useMemo, useState } from "react";

// SMELL: premature memoization. useMemo to add two numbers, useCallback for handlers passed
// to DOM elements and memo on a trivial component whose props change on every render anyway.
// More code, more dependencies to maintain (and forget) and zero measured benefit.
const Label = memo(function Label({ text }: { text: string }) {
  return <span>{text}</span>;
});

export function TipCalculator() {
  const [bill, setBill] = useState(50);
  const [tipPercent, setTipPercent] = useState(10);

  const tip = useMemo(() => (bill * tipPercent) / 100, [bill, tipPercent]);
  const total = useMemo(() => bill + tip, [bill, tip]);
  const label = useMemo(() => `Total: ${total.toFixed(2)} €`, [total]);

  const handleBill = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setBill(Number(e.target.value)), []);
  const handleTip = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTipPercent(Number(e.target.value)), []);

  return (
    <div>
      <input aria-label="Bill" type="number" value={bill} onChange={handleBill} />
      <input aria-label="Tip %" type="number" value={tipPercent} onChange={handleTip} />
      <Label text={label} />
    </div>
  );
}
