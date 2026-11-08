export interface DateRange {
  start: Date;
  end: Date;
}

// REFACTOR: principle of least surprise: each function does what its name suggests.
export function parseDay(iso: string): Date {
  const date = new Date(`${iso}T00:00:00Z`);
  // REFACTOR: non-existent dates are rejected instead of silently overflowing.
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) {
    throw new RangeError(`Invalid date: ${iso}`);
  }
  return date;
}

// REFACTOR: a range of days includes both ends, as any user expects.
export function contains(range: DateRange, day: Date): boolean {
  return day >= range.start && day <= range.end;
}

// REFACTOR: formatting a price means two decimals and the correct sign.
export function formatPrice(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${Math.abs(amount).toFixed(2)} €`;
}
