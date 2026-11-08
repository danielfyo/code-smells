import type { StockLine } from './model';

export class SkuNotFoundError extends Error {}

// SMELL: Exceptions for Control Flow. A missing SKU is a perfectly normal case during an import
// (new products arrive every week), yet it is signalled with an exception and the caller uses
// try/catch as an if/else. It is slower, hides real errors and obscures the intent.
export class InventorySmelly {
  private readonly stock = new Map<string, number>([['MUG-01', 4]]);

  quantityOf(sku: string): number {
    const quantity = this.stock.get(sku);
    if (quantity === undefined) throw new SkuNotFoundError(sku);
    return quantity;
  }

  importLines(lines: readonly StockLine[]): string[] {
    const log: string[] = [];
    for (const line of lines) {
      try {
        const current = this.quantityOf(line.sku);
        this.stock.set(line.sku, current + line.quantity);
        log.push(`updated ${line.sku}`);
      } catch (error) {
        if (error instanceof SkuNotFoundError) {
          this.stock.set(line.sku, line.quantity);
          log.push(`created ${line.sku}`);
        } else {
          throw error;
        }
      }
    }
    return log;
  }

  snapshot(): [string, number][] {
    return [...this.stock];
  }
}
