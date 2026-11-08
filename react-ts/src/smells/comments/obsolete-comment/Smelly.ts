export interface Booking {
  nights: number;
  nightlyRate: number;
  guests: number;
}

// SMELL: obsolete comment. It says the tourist tax is €1 per night, but the code charges
// €2.50 per guest per night. The comment lies and nobody updated it.
/**
 * Computes the booking price. Adds a €1 tourist tax per night.
 * Bookings longer than 7 nights get a 5% discount.
 */
export function bookingPrice(booking: Booking): number {
  const base = booking.nights * booking.nightlyRate;
  // SMELL: "5% discount" is no longer true: it is now 10% from 7 nights inclusive.
  const discount = booking.nights >= 7 ? base * 0.1 : 0;
  // SMELL: "tax per night": it is actually per guest per night.
  const touristTax = booking.nights * booking.guests * 2.5;
  return base - discount + touristTax;
}
