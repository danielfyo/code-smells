// REFACTOR: each language in its place. SQL lives in productQueries.ts, markup is typed
// JSX (no HTML in strings) and styles are typed objects (or would go to a .css file).
import type { CSSProperties } from "react";

export { buildProductQuery } from "./productQueries";

export interface Product {
  id: number;
  name: string;
  price: number;
}

const listStyle: CSSProperties = { listStyle: "none", padding: 0 };
const priceStyle: CSSProperties = { fontWeight: "bold" };

export function ProductList({ products }: { products: Product[] }) {
  return (
    <section>
      <ul className="product-list" style={listStyle}>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} <span style={priceStyle}>{product.price.toFixed(2)} €</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
