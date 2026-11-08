export interface Product {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

// SMELL: Combinatorial Explosion. One function per combination of filters.
// With 3 criteria there are already 7 almost identical variants; a fourth
// criterion (brand) would double the number of functions.
export function byCategory(products: Product[], category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function byMaxPrice(products: Product[], max: number): Product[] {
  return products.filter((p) => p.price <= max);
}

export function inStock(products: Product[]): Product[] {
  return products.filter((p) => p.inStock);
}

export function byCategoryAndMaxPrice(products: Product[], category: string, max: number): Product[] {
  return products.filter((p) => p.category === category && p.price <= max);
}

export function byCategoryInStock(products: Product[], category: string): Product[] {
  return products.filter((p) => p.category === category && p.inStock);
}

export function byMaxPriceInStock(products: Product[], max: number): Product[] {
  return products.filter((p) => p.price <= max && p.inStock);
}

export function byCategoryAndMaxPriceInStock(products: Product[], category: string, max: number): Product[] {
  return products.filter((p) => p.category === category && p.price <= max && p.inStock);
}
