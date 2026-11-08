// REFACTOR: the dependency becomes physical and explicit: the API response includes its
// own pageSize and the page count receives it as data instead of assuming it.
export interface Page<T> {
  items: T[];
  totalItems: number;
  pageSize: number;
}

const items = Array.from({ length: 95 }, (_, i) => `Order #${i + 1}`);

export function fetchOrdersPage(page: number, apiPageSize = 20): Page<string> {
  const start = (page - 1) * apiPageSize;
  return { items: items.slice(start, start + apiPageSize), totalItems: items.length, pageSize: apiPageSize };
}

export function totalPages(page: Pick<Page<unknown>, "totalItems" | "pageSize">): number {
  return Math.ceil(page.totalItems / page.pageSize);
}
