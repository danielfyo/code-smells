// REFACTOR: Remove Control Flag / Replace Loop with Pipeline. `findIndex` stops at the first
// match by itself, and a named predicate says what we look for.
function seatsAreFree(row: readonly boolean[], start: number, needed: number): boolean {
  return row.slice(start, start + needed).every((occupied) => !occupied);
}

/** Index of the first block of `needed` free seats, or -1 if there is none. */
export function firstAdjacentFreeSeats(row: readonly boolean[], needed: number): number {
  const lastStart = row.length - needed;
  if (lastStart < 0) return -1;
  return Array.from({ length: lastStart + 1 }, (_, start) => start).findIndex((start) =>
    seatsAreFree(row, start, needed),
  );
}
