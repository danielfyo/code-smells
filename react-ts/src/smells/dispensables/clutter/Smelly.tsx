// SMELL: Clutter. Unused imports, empty effects, an unnecessary Fragment,
// redundant intermediate variables, `else` after `return`, `=== true`
// comparisons and obvious comments. None of it is a bug, but all of it is noise.
import { Fragment, useEffect, useMemo, useState } from "react";

export interface Product {
  name: string;
  stock: number;
}

export function StockBadge({ product }: { product: Product }) {
  // SMELL: state declared and never read.
  const [, setRenders] = useState(0);
  void setRenders;

  // SMELL: empty effect that does nothing.
  useEffect(() => {}, []);

  // SMELL: useMemo over a trivial computation and a variable that is merely forwarded.
  const isAvailable = useMemo(() => product.stock > 0, [product.stock]);
  const available = isAvailable;

  // get the label
  function getLabel(): string {
    if (available === true) {
      const label = product.stock < 5 ? "Last units" : "In stock";
      return label;
    } else {
      return "Sold out";
    }
  }

  // SMELL: Fragment wrapping a single child.
  return (
    <Fragment>
      <span className="badge">
        {product.name}: {getLabel()}
      </span>
    </Fragment>
  );
}
