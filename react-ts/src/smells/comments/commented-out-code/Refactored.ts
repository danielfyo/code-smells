export interface Product {
  name: string;
  price: number;
  stock: number;
}

// REFACTOR: all commented-out code is deleted. If it is ever needed again, git history
// keeps it; the file only shows what actually runs.
export function availableProducts(products: Product[]): Product[] {
  return products
    .filter((product) => product.stock > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}
