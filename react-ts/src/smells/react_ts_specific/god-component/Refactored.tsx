import { useEffect, useState } from "react";

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: "pending" | "shipped";
}

// REFACTOR: split by responsibility:
// 1) pure business rules (testable without React),
// 2) a data hook,
// 3) small presentational components,
// 4) a container that only composes.
const VAT = 1.21;
const VIP_DISCOUNT = 0.9;

export function orderRevenue(order: Order): number {
  const withVat = order.total * VAT;
  return order.customer.startsWith("VIP") ? withVat * VIP_DISCOUNT : withVat;
}

function useOrders(loadOrders: () => Promise<Order[]>) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    loadOrders().then(setOrders);
  }, [loadOrders]);
  return orders;
}

function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          #{order.id} {order.customer} — {order.status === "pending" ? "Pending" : "Shipped"}
        </li>
      ))}
    </ul>
  );
}

function PendingFilter({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      Pending only
    </label>
  );
}

export function OrdersDashboard({ loadOrders }: { loadOrders: () => Promise<Order[]> }) {
  const orders = useOrders(loadOrders);
  const [onlyPending, setOnlyPending] = useState(false);
  if (!orders) return <p>Loading…</p>;

  const visible = orders.filter((order) => !onlyPending || order.status === "pending");
  const revenue = visible.reduce((sum, order) => sum + orderRevenue(order), 0);
  return (
    <section>
      <h2>Orders</h2>
      <PendingFilter checked={onlyPending} onChange={setOnlyPending} />
      <OrderList orders={visible} />
      <p>Revenue: {revenue.toFixed(2)} €</p>
    </section>
  );
}
