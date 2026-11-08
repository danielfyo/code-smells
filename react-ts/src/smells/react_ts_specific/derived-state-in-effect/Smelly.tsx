import { useEffect, useState } from "react";

export interface Product {
  id: number;
  name: string;
}

// SMELL: derived state computed in an effect. "filtered" can be derived directly from
// props + state during render, but it is stored in another useState and synced with
// useEffect: an extra render with stale data and a duplicated source of truth.
export function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Product[]>(products);
  const [count, setCount] = useState(products.length);

  useEffect(() => {
    const next = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    setFiltered(next);
    setCount(next.length); // SMELL: yet another piece of derived state
  }, [products, query]);

  return (
    <div>
      <input aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>{count} results</p>
      <ul>
        {filtered.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
