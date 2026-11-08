export interface Product {
  sku: string;
  price: number;
}

export class NotFoundError extends Error {}

export class Catalog {
  constructor(private readonly products: Product[]) {}

  // SMELL: not finding a product is a normal case, but it is treated as exceptional.
  get(sku: string): Product {
    const product = this.products.find((p) => p.sku === sku);
    if (!product) throw new NotFoundError(sku);
    return product;
  }
}

// SMELL: Exceptions for Control Flow. The normal flow ("does the SKU exist?",
// "is the quantity a number?") is decided by throwing and catching exceptions.
// It is slow, hides the happy path, and a generic `catch` can swallow real bugs.
export function priceList(catalog: Catalog, lines: string[]): { total: number; unknown: string[] } {
  let total = 0;
  const unknown: string[] = [];
  for (const line of lines) {
    const [sku, rawQty] = line.split(":");
    try {
      const qty = Number(rawQty);
      if (!Number.isInteger(qty)) throw new Error("quantity");
      total += catalog.get(sku).price * qty;
    } catch {
      unknown.push(sku);
    }
  }
  return { total, unknown };
}
