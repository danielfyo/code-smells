import { useState } from "react";

// REFACTOR: Remove Dead Code. The function without callers, the obsolete prop,
// the unused variable, the unreachable branch and the commented-out JSX are
// removed. Version control already keeps the history: no need to keep it here.
interface CouponBoxProps {
  codes: string[];
}

export function CouponBox({ codes }: CouponBoxProps) {
  const [applied, setApplied] = useState<string | null>(null);

  return (
    <div>
      {codes.map((code) => (
        <button key={code} onClick={() => setApplied(code.toUpperCase())}>
          {code}
        </button>
      ))}
      <p>{applied ? `Applied: ${applied}` : "No coupon applied"}</p>
    </div>
  );
}
