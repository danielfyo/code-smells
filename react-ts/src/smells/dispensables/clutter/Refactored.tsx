// REFACTOR: Remove Dead Code / Inline Variable / Remove Redundant Else.
// Only what adds value remains: no useless imports, state, effects or wrappers.
export interface Product {
  name: string;
  stock: number;
}

const LOW_STOCK = 5;

function stockLabel(stock: number): string {
  if (stock <= 0) return "Sold out";
  return stock < LOW_STOCK ? "Last units" : "In stock";
}

export function StockBadge({ product }: { product: Product }) {
  return (
    <span className="badge">
      {product.name}: {stockLabel(product.stock)}
    </span>
  );
}
