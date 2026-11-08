// REFACTOR: Inline Class / Inline Component. The one-line class becomes a
// plain function and the empty component disappears: <td> is used directly.
const euros = (amount: number): string => `${amount.toFixed(2)} €`;

export interface OrderRowData {
  id: string;
  customer: string;
  total: number;
}

export function OrdersTable({ orders }: { orders: OrderRowData[] }) {
  return (
    <table>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{o.customer}</td>
            <td>{euros(o.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
