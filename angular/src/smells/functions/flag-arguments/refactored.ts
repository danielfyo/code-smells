import type { Product } from './model';

const VAT = 0.21;

// REFACTOR: Remove Flag Argument / Split Function. One explicit function per behavior; the call
// site says which one it wants.
export function customerPriceLabel(product: Product): string {
  return `${product.name}: ${((product.priceCents * (1 + VAT)) / 100).toFixed(2)} € (VAT incl.)`;
}

export function adminPriceLabel(product: Product): string {
  const margin = ((product.priceCents - product.costCents) / product.priceCents) * 100;
  return `${product.name}: cost ${(product.costCents / 100).toFixed(2)}, margin ${margin.toFixed(0)}%`;
}
