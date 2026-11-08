import type { StockLine } from './model';

// REFACTOR: Replace Exception with Test. "Is this SKU known?" is an ordinary question answered
// with an ordinary condition; exceptions stay reserved for truly exceptional failures.
export class Inventory {
  private readonly stock = new Map<string, number>([['MUG-01', 4]]);

  quantityOf(sku: string): number | undefined {
    return this.stock.get(sku);
  }

  importLines(lines: readonly StockLine[]): string[] {
    return lines.map(({ sku, quantity }) => {
      const current = this.quantityOf(sku);
      this.stock.set(sku, (current ?? 0) + quantity);
      return current === undefined ? `created ${sku}` : `updated ${sku}`;
    });
  }

  snapshot(): [string, number][] {
    return [...this.stock];
  }
}
