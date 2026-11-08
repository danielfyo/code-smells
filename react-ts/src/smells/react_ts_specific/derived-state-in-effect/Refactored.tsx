import { useState } from "react";

export interface Product {
  id: number;
  name: string;
}

// REFACTOR: whatever can be derived is computed during render. A single source of truth
// (query + products), with no effects or intermediate renders with stale data.
// (If the computation were truly expensive, it would be wrapped in useMemo after measuring.)
export function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const filtered = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <input aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>{filtered.length} results</p>
      <ul>
        {filtered.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
