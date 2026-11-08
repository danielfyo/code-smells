export interface Order {
  id: string;
  total: number;
}

// REFACTOR: Move Function + Encapsulate Collection + explicit interface.
// Communication between modules is a visible contract (`InvoiceSink`): orders
// publishes, accounting receives. Neither knows the other's internal structures.
export interface InvoiceSink {
  record(order: Order): void;
}

export class OrderService {
  readonly #placed: string[] = [];

  constructor(private readonly invoices: InvoiceSink) {}

  place(order: Order): void {
    this.#placed.push(order.id);
    this.invoices.record(order);
  }

  get placed(): readonly string[] {
    return [...this.#placed];
  }
}

export class Accounting implements InvoiceSink {
  readonly #pending: Order[] = [];
  readonly #ledger: string[] = [];

  record(order: Order): void {
    this.#pending.push(order);
  }

  closeDay(): number {
    const revenue = this.#pending.reduce((sum, o) => sum + o.total, 0);
    for (const order of this.#pending) this.#ledger.push(`${order.id}:${order.total.toFixed(2)}`);
    this.#pending.length = 0;
    return revenue;
  }

  get ledger(): readonly string[] {
    return [...this.#ledger];
  }
}
