// REFACTOR: Encapsulate Collection + Move Function + Hide Delegate. The
// inventory protects its state (`#private` fields) and offers a meaningful
// operation (`reserve`). The cart only talks to that public interface.
export class Inventory {
  readonly #stock = new Map<string, number>();
  readonly #reservations: { sku: string; qty: number }[] = [];

  constructor(initial: Record<string, number>) {
    for (const [sku, qty] of Object.entries(initial)) this.#stock.set(sku, qty);
  }

  available(sku: string): number {
    return this.#stock.get(sku) ?? 0;
  }

  reserve(sku: string, qty: number): boolean {
    const current = this.available(sku);
    if (current < qty) return false;
    this.#stock.set(sku, current - qty);
    this.#reservations.push({ sku, qty });
    return true;
  }

  get reservationCount(): number {
    return this.#reservations.length;
  }
}

export class Cart {
  readonly #lines = new Map<string, number>();

  constructor(private readonly inventory: Inventory) {}

  add(sku: string, qty: number): boolean {
    if (!this.inventory.reserve(sku, qty)) return false;
    this.#lines.set(sku, this.quantity(sku) + qty);
    return true;
  }

  quantity(sku: string): number {
    return this.#lines.get(sku) ?? 0;
  }
}
