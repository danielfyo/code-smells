import { useEffect, useState } from "react";

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: "pending" | "shipped";
}

// SMELL: god component. It fetches data, manages filters, applies business rules
// (VAT, VIP discounts), computes statistics and renders the whole UI. Impossible to reuse
// or test piece by piece; every change touches this single huge file.
export function OrdersDashboard({ loadOrders }: { loadOrders: () => Promise<Order[]> }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyPending, setOnlyPending] = useState(false);

  useEffect(() => {
    loadOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [loadOrders]);

  if (loading) return <p>Loading…</p>;

  const visible = orders.filter((o) => !onlyPending || o.status === "pending");
  let revenue = 0;
  for (const o of visible) {
    const withVat = o.total * 1.21;
    revenue += o.customer.startsWith("VIP") ? withVat * 0.9 : withVat;
  }

  return (
    <section>
      <h2>Orders</h2>
      <label>
        <input type="checkbox" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} />
        Pending only
      </label>
      <ul>
        {visible.map((o) => (
          <li key={o.id}>
            #{o.id} {o.customer} — {o.status === "pending" ? "Pending" : "Shipped"}
          </li>
        ))}
      </ul>
      <p>Revenue: {revenue.toFixed(2)} €</p>
    </section>
  );
}
