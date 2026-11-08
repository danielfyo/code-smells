// SMELL: Inappropriate Intimacy. `Cart` knows and directly manipulates the
// guts of `Inventory` (its internal stock map and its reservation log). Any
// change to the inventory's internal representation breaks the cart.
export class Inventory {
  // SMELL: internal state exposed "so the cart can use it".
  stock = new Map<string, number>();
  reservations: { sku: string; qty: number }[] = [];

  constructor(initial: Record<string, number>) {
    for (const [sku, qty] of Object.entries(initial)) this.stock.set(sku, qty);
  }

  available(sku: string): number {
    return this.stock.get(sku) ?? 0;
  }
}

export class Cart {
  private lines = new Map<string, number>();

  constructor(private inventory: Inventory) {}

  add(sku: string, qty: number): boolean {
    // SMELL: the cart decides on and modifies someone else's stock on its own.
    const current = this.inventory.stock.get(sku) ?? 0;
    if (current < qty) return false;
    this.inventory.stock.set(sku, current - qty);
    this.inventory.reservations.push({ sku, qty });
    this.lines.set(sku, (this.lines.get(sku) ?? 0) + qty);
    return true;
  }

  quantity(sku: string): number {
    return this.lines.get(sku) ?? 0;
  }
}
