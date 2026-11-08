// Production code: warehouse inventory.
export class Inventory {
  private stock = new Map<string, number>();

  receive(sku: string, units: number): void {
    this.stock.set(sku, this.unitsOf(sku) + units);
  }

  ship(sku: string, units: number): void {
    const available = this.unitsOf(sku);
    if (units > available) throw new Error(`Insufficient stock of ${sku}`);
    this.stock.set(sku, available - units);
  }

  unitsOf(sku: string): number {
    return this.stock.get(sku) ?? 0;
  }
}
