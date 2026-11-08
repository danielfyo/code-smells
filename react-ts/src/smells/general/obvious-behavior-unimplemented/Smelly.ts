export interface DateRange {
  start: Date;
  end: Date;
}

// SMELL: obvious behavior unimplemented.
// - "parseDay" accepts "2024-02-30" without complaint (Date overflows it into March).
// - "contains" excludes the last day of the range, when anyone would expect it included.
// - "formatPrice" neither rounds nor handles negatives, despite what its name promises.
export function parseDay(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function contains(range: DateRange, day: Date): boolean {
  return day >= range.start && day < range.end;
}

export function formatPrice(amount: number): string {
  return `${amount} €`;
}
