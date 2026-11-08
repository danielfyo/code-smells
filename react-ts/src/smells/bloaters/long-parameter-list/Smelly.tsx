// SMELL: Long Parameter List. Twelve loose props: it is easy to mix up
// checkIn/checkOut or adults/children, and every consumer must know all of them.
export interface BookingCardProps {
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  adults: number;
  children: number;
  nightlyRate: number;
  currency: string;
  nights: number;
  showPrice: boolean;
  compact: boolean;
}

export function BookingCard(props: BookingCardProps) {
  const {
    guestName,
    guestEmail,
    checkIn,
    checkOut,
    roomType,
    adults,
    children,
    nightlyRate,
    currency,
    nights,
    showPrice,
    compact,
  } = props;

  return (
    <article className={compact ? "card compact" : "card"}>
      <h3>{guestName}</h3>
      {!compact && <p>{guestEmail}</p>}
      <p>
        {roomType}: {checkIn} → {checkOut} ({nights} nights)
      </p>
      <p>
        {adults} adults, {children} children
      </p>
      {showPrice && (
        <p>
          Total: {(nightlyRate * nights).toFixed(2)} {currency}
        </p>
      )}
    </article>
  );
}

// SMELL: the call site is a long string of values that is hard to review.
export function SmellyBookingExample() {
  return (
    <BookingCard
      guestName="Lucy Parker"
      guestEmail="lucy@hotel.test"
      checkIn="2026-07-01"
      checkOut="2026-07-04"
      roomType="Double"
      adults={2}
      children={1}
      nightlyRate={95}
      currency="EUR"
      nights={3}
      showPrice={true}
      compact={false}
    />
  );
}
