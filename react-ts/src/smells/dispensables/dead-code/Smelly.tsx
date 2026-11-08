import { useState } from "react";

// SMELL: Dead Code. This component drags along leftovers nobody uses: an
// obsolete prop, a function that is never called, a value computed and thrown
// away and a branch that can never run. All of it must be read and maintained.

// SMELL: orphan function from a previous version; it has no callers.
export function legacyDiscount(price: number): number {
  return price * 0.85;
}

interface CouponBoxProps {
  codes: string[];
  /** @deprecated no longer used since v2 */
  showLegacyBanner?: boolean;
}

export function CouponBox({ codes }: CouponBoxProps) {
  const [applied, setApplied] = useState<string | null>(null);
  // SMELL: computed value that is not used anywhere.
  const totalCodes = codes.length;
  void totalCodes;

  function apply(code: string) {
    const normalized = code.toUpperCase();
    // SMELL: impossible branch: `normalized` is always a string after toUpperCase().
    if (typeof normalized !== "string") {
      console.warn("Invalid code");
      return;
    }
    setApplied(normalized);
  }

  return (
    <div>
      {codes.map((code) => (
        <button key={code} onClick={() => apply(code)}>
          {code}
        </button>
      ))}
      {/* SMELL: markup commented out "just in case" */}
      {/* <p className="legacy">Use code OLD10</p> */}
      <p>{applied ? `Applied: ${applied}` : "No coupon applied"}</p>
    </div>
  );
}
