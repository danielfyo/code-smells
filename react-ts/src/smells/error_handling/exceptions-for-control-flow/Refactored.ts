export interface Product {
  sku: string;
  price: number;
}

// REFACTOR: Replace Exception with Precheck / Test. The lookup returns
// `undefined` when there is no product (an expected case) and the quantity is
// validated with a condition. Exceptions are kept for the truly exceptional.
export class Catalog {
  private readonly bySku: Map<string, Product>;

  constructor(products: Product[]) {
    this.bySku = new Map(products.map((p) => [p.sku, p]));
  }

  find(sku: string): Product | undefined {
    return this.bySku.get(sku);
  }
}

export function priceList(catalog: Catalog, lines: string[]): { total: number; unknown: string[] } {
  let total = 0;
  const unknown: string[] = [];
  for (const line of lines) {
    const [sku, rawQty] = line.split(":");
    const qty = Number(rawQty);
    const product = catalog.find(sku);
    if (product && Number.isInteger(qty)) total += product.price * qty;
    else unknown.push(sku);
  }
  return { total, unknown };
}
