// SMELL: Incorrect Behavior at the Boundaries. The page computation works "in
// the typical case" (7 items, 3 per page), but fails right at the edges: with an
// exact multiple of items an empty last page appears, with an empty list it says
// "Page 1 of 1", and an out-of-range page is not clamped.
export function pageCount(total: number, size: number): number {
  return Math.floor(total / size) + 1;
}

export function Paginator({ items, size, page }: { items: string[]; size: number; page: number }) {
  const pages = pageCount(items.length, size);
  const start = (page - 1) * size;
  const visible = items.slice(start, start + size);
  return (
    <nav>
      <ul>
        {visible.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span>
        Page {page} of {pages}
      </span>
    </nav>
  );
}
