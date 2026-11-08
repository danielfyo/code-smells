import { useState } from "react";

// REFACTOR: the component is defined at module level. Its identity is stable across
// renders, so React reconciles it and keeps its state when the parent re-renders.
function QuantityInput() {
  const [quantity, setQuantity] = useState(1);
  return (
    <label>
      Quantity
      <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
    </label>
  );
}

export function CheckoutPage() {
  const [coupon, setCoupon] = useState("");
  return (
    <form>
      <QuantityInput />
      <label>
        Coupon
        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} />
      </label>
    </form>
  );
}
