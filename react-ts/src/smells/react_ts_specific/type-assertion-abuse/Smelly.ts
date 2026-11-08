export interface Product {
  id: number;
  name: string;
  price: number;
}

// SMELL: type assertion abuse. "as Product[]" checks nothing at runtime: it only convinces
// the compiler. If the API returns another shape (price as a string, an error object...),
// the code carries on with bogus data.
export async function loadProducts(fetchJson: () => Promise<unknown>): Promise<Product[]> {
  const data = (await fetchJson()) as Product[];
  return data;
}

export function cheapestPrice(products: Product[]): number {
  return Math.min(...products.map((p) => p.price));
}

// SMELL: double assertion "as unknown as" to force an incompatible type.
export function toProduct(row: string[]): Product {
  return row as unknown as Product;
}
