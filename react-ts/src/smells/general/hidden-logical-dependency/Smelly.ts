// SMELL: logical rather than physical dependency. The paginator "knows" the API returns
// 20 items per page, but nobody tells it: it assumes so with a copied number.
// If the API changes its page size, the page count breaks silently.
export interface Page<T> {
  items: T[];
  totalItems: number;
}

const items = Array.from({ length: 95 }, (_, i) => `Order #${i + 1}`);

// "API" module: decides the page size internally.
export function fetchOrdersPage(page: number, apiPageSize = 20): Page<string> {
  const start = (page - 1) * apiPageSize;
  return { items: items.slice(start, start + apiPageSize), totalItems: items.length };
}

// "UI" module: assumes (without asking) that each page holds 20.
export function totalPages(totalItems: number): number {
  return Math.ceil(totalItems / 20); // SMELL: magic 20 duplicated from another module.
}
