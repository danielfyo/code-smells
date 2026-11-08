import { useState } from "react";

// SMELL: props copied to state. useState(price) only uses the prop on the FIRST render;
// if the parent changes the price (e.g. currency switch or a new offer), the component
// keeps showing the old value. There are two out-of-sync sources of truth.
export function PriceTag({ price, label }: { price: number; label: string }) {
  const [displayPrice] = useState(price);
  const [title] = useState(label.toUpperCase());
  return (
    <p>
      {title}: {displayPrice.toFixed(2)} €
    </p>
  );
}
