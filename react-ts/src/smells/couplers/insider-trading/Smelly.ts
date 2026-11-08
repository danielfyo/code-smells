// SMELL: Insider Trading. The orders and accounting modules pass information
// "under the table": accounting directly reads and empties the internal list of
// pending orders, and orders write into the accounting ledger. Neither has an
// explicit interface.
export interface Order {
  id: string;
  total: number;
}

export const orderModule = {
  // SMELL: internal structure that another module knows about and manipulates.
  _pendingInvoices: [] as Order[],
  placed: [] as string[],

  place(order: Order): void {
    this.placed.push(order.id);
    this._pendingInvoices.push(order);
  },
};

export const accountingModule = {
  ledger: [] as string[],

  closeDay(): number {
    // SMELL: accounting reaches into the guts of orders and mutates them.
    const pending = orderModule._pendingInvoices;
    let revenue = 0;
    for (const order of pending) {
      this.ledger.push(`${order.id}:${order.total.toFixed(2)}`);
      revenue += order.total;
    }
    orderModule._pendingInvoices = [];
    return revenue;
  },
};

export function reset(): void {
  orderModule._pendingInvoices = [];
  orderModule.placed = [];
  accountingModule.ledger = [];
}
