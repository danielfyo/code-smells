// REFACTOR: Extract Function / Move Function. Business rules move to a pure module with
// no React: easy to read, to test in isolation and to reuse.
export const WEEKEND_SURCHARGE = 0.2;
export const LONG_STAY_NIGHTS = 7;
export const LONG_STAY_DISCOUNT = 0.15;

export type Quote = { ok: true; price: number } | { ok: false; error: string };

export function quoteStay(pricePerNight: number, nights: number, includesWeekend: boolean): Quote {
  if (nights < 1) return { ok: false, error: "Minimum one night" };
  let price = pricePerNight * nights;
  if (includesWeekend) price *= 1 + WEEKEND_SURCHARGE;
  if (nights >= LONG_STAY_NIGHTS) price *= 1 - LONG_STAY_DISCOUNT;
  return { ok: true, price };
}
