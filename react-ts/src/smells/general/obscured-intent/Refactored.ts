export interface Product {
  name: string;
  price: number;
  stock: number;
  tags: string[];
}

const SALE_TAG = "sale";
const SALE_PRICE_FACTOR = 0.8;
const LOW_STOCK_LIMIT = 5;

// REFACTOR: clever code is replaced by obvious code: explanatory names,
// separate steps and operators used with their usual meaning.
function isOnSaleAndAvailable(product: Product): boolean {
  return product.stock > 0 && product.tags.includes(SALE_TAG);
}

export function summarize(products: Product[]): { n: number; t: number } {
  const saleProducts = products.filter(isOnSaleAndAvailable);
  const totalSalePrice = saleProducts.reduce((sum, product) => sum + product.price * SALE_PRICE_FACTOR, 0);
  return { n: saleProducts.length, t: totalSalePrice };
}

export function lowStock(products: Product[]): boolean {
  return products.some((product) => product.stock > 0 && product.stock < LOW_STOCK_LIMIT);
}
