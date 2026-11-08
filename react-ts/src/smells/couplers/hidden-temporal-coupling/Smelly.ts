export interface Sale {
  region: string;
  amount: number;
}

// SMELL: Hidden Temporal Coupling. You must call `setData`, then `setCurrency`
// and then `build`, in that order. Nothing in the API says so or enforces it: if
// the order is swapped or a step is forgotten, the report comes out empty or
// with the default currency and nobody notices.
export class SalesReport {
  private sales: Sale[] = [];
  private currency = "USD";
  private totals = new Map<string, number>();

  setData(sales: Sale[]): void {
    this.sales = sales;
    // SMELL: the aggregate is computed here; if data changes later it is not recomputed.
    this.totals.clear();
    for (const s of this.sales) this.totals.set(s.region, (this.totals.get(s.region) ?? 0) + s.amount);
  }

  setCurrency(currency: string): void {
    this.currency = currency;
  }

  build(): string[] {
    return [...this.totals].map(([region, total]) => `${region}: ${total.toFixed(2)} ${this.currency}`);
  }
}
