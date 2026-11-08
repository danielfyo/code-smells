// REFACTOR: Introduce Parameter Object. Props that travel together are grouped
// into types with domain meaning (guest, stay, rate, display options).
export interface Guest {
  name: string;
  email: string;
}

export interface Stay {
  checkIn: string;
  checkOut: string;
  roomType: string;
  nights: number;
  adults: number;
  children: number;
}

export interface Rate {
  nightly: number;
  currency: string;
}

export interface CardDisplay {
  showPrice?: boolean;
  compact?: boolean;
}

export interface BookingCardProps {
  guest: Guest;
  stay: Stay;
  rate: Rate;
  display?: CardDisplay;
}

// REFACTOR: Move Function. Computing the total belongs to stay + rate.
export const stayTotal = (stay: Stay, rate: Rate): number => rate.nightly * stay.nights;

export function BookingCard({ guest, stay, rate, display = {} }: BookingCardProps) {
  const { showPrice = true, compact = false } = display;
  return (
    <article className={compact ? "card compact" : "card"}>
      <h3>{guest.name}</h3>
      {!compact && <p>{guest.email}</p>}
      <p>
        {stay.roomType}: {stay.checkIn} → {stay.checkOut} ({stay.nights} nights)
      </p>
      <p>
        {stay.adults} adults, {stay.children} children
      </p>
      {showPrice && (
        <p>
          Total: {stayTotal(stay, rate).toFixed(2)} {rate.currency}
        </p>
      )}
    </article>
  );
}

// REFACTOR: the call site passes named objects that can be reused.
export function RefactoredBookingExample() {
  const guest: Guest = { name: "Lucy Parker", email: "lucy@hotel.test" };
  const stay: Stay = {
    checkIn: "2026-07-01",
    checkOut: "2026-07-04",
    roomType: "Double",
    nights: 3,
    adults: 2,
    children: 1,
  };
  return <BookingCard guest={guest} stay={stay} rate={{ nightly: 95, currency: "EUR" }} />;
}
