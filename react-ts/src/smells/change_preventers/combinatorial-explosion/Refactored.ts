export interface Product {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

// REFACTOR: Parameterize Function + Specification pattern. Each criterion is an
// independent predicate and they combine freely: N criteria = N pieces, not 2^N functions.
export type Spec = (p: Product) => boolean;

export const categoryIs =
  (category: string): Spec =>
  (p) =>
    p.category === category;
export const priceAtMost =
  (max: number): Spec =>
  (p) =>
    p.price <= max;
export const available: Spec = (p) => p.inStock;

export const allOf =
  (...specs: Spec[]): Spec =>
  (p) =>
    specs.every((spec) => spec(p));

export interface ProductQuery {
  category?: string;
  maxPrice?: number;
  inStockOnly?: boolean;
}

// REFACTOR: a single function with an optional query object.
export function findProducts(products: Product[], query: ProductQuery = {}): Product[] {
  const specs: Spec[] = [];
  if (query.category !== undefined) specs.push(categoryIs(query.category));
  if (query.maxPrice !== undefined) specs.push(priceAtMost(query.maxPrice));
  if (query.inStockOnly) specs.push(available);
  return products.filter(allOf(...specs));
}
