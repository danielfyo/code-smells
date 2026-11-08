import { useState } from "react";

// SMELL: component defined inside another. Every CheckoutPage render creates a NEW
// QuantityInput function; to React it's a different component type, so it unmounts the
// old one and mounts a new one: internal state and focus are lost.
export function CheckoutPage() {
  const [coupon, setCoupon] = useState("");

  function QuantityInput() {
    const [quantity, setQuantity] = useState(1);
    return (
      <label>
        Quantity
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </label>
    );
  }

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
