// REFACTOR: Move Field. Generic paging knowledge lives in its own module, owned by no screen.
export const PAGE_SIZE = 3;
export const FIRST_PAGE = 1;

export function pageOf<T>(items: readonly T[], page: number, pageSize = PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
