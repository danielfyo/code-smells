// Production code: summary of a product catalog.
export interface CatalogProduct {
  sku: string;
  price: number;
  active: boolean;
}

export interface CatalogSummary {
  activeCount: number;
  averagePrice: number;
}

export function summarizeCatalog(products: CatalogProduct[]): CatalogSummary {
  const active = products.filter((product) => product.active);
  const totalPrice = active.reduce((sum, product) => sum + product.price, 0);
  return {
    activeCount: active.length,
    averagePrice: active.length === 0 ? 0 : Math.round((totalPrice / active.length) * 100) / 100,
  };
}
