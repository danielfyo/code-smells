// REFACTOR: handle the boundaries explicitly and in one place. `Math.ceil` is
// used (no "eyeballed" +1), the empty-list case is defined, and the requested
// page is clamped to the valid range [1, pages].
export function pageCount(total: number, size: number): number {
  if (size <= 0) throw new RangeError("Page size must be positive");
  return Math.ceil(total / size);
}

export const clampPage = (page: number, pages: number): number => Math.min(Math.max(1, page), Math.max(1, pages));

export function Paginator({ items, size, page }: { items: string[]; size: number; page: number }) {
  const pages = pageCount(items.length, size);
  if (pages === 0) {
    return (
      <nav>
        <span>No results</span>
      </nav>
    );
  }
  const current = clampPage(page, pages);
  const start = (current - 1) * size;
  return (
    <nav>
      <ul>
        {items.slice(start, start + size).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span>
        Page {current} of {pages}
      </span>
    </nav>
  );
}
