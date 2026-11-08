import type { ReactNode } from "react";

// SMELL: Lazy Class. `CurrencyFormatter` is a whole class for a single line,
// and `Cell` is a component that merely forwards its children to a <td>.
// Neither provides any abstraction: they only add jumps when reading the code.
class CurrencyFormatter {
  format(amount: number): string {
    return `${amount.toFixed(2)} €`;
  }
}

function Cell({ children }: { children: ReactNode }) {
  return <td>{children}</td>;
}

export interface OrderRowData {
  id: string;
  customer: string;
  total: number;
}

export function OrdersTable({ orders }: { orders: OrderRowData[] }) {
  const formatter = new CurrencyFormatter();
  return (
    <table>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <Cell>{o.id}</Cell>
            <Cell>{o.customer}</Cell>
            <Cell>{formatter.format(o.total)}</Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
