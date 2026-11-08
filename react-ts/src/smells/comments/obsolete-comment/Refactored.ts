export interface Booking {
  nights: number;
  nightlyRate: number;
  guests: number;
}

// REFACTOR: the magic numbers the comment tried to explain become named constants.
// The code itself is now the "comment", so it cannot drift out of date.
const TOURIST_TAX_PER_GUEST_NIGHT = 2.5;
const LONG_STAY_MIN_NIGHTS = 7;
const LONG_STAY_DISCOUNT = 0.1;

/** Booking price: base with long-stay discount + tourist tax. */
export function bookingPrice(booking: Booking): number {
  const base = booking.nights * booking.nightlyRate;
  const discount = booking.nights >= LONG_STAY_MIN_NIGHTS ? base * LONG_STAY_DISCOUNT : 0;
  const touristTax = booking.nights * booking.guests * TOURIST_TAX_PER_GUEST_NIGHT;
  return base - discount + touristTax;
}
