import type { Product } from './model';

// SMELL: Flag Argument. `forAdmin` selects between two completely different behaviors. Call
// sites read `priceLabel(product, true)`, and the function has to know about both audiences.
export function priceLabel(product: Product, forAdmin: boolean): string {
  if (forAdmin) {
    const margin = ((product.priceCents - product.costCents) / product.priceCents) * 100;
    return `${product.name}: cost ${(product.costCents / 100).toFixed(2)}, margin ${margin.toFixed(0)}%`;
  } else {
    return `${product.name}: ${((product.priceCents * 1.21) / 100).toFixed(2)} € (VAT incl.)`;
  }
}
