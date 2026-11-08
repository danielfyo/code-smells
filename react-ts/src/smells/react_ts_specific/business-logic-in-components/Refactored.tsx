import { useState } from "react";
import { quoteStay } from "./bookingPricing";

export interface Room {
  name: string;
  pricePerNight: number;
}

// REFACTOR: the component only manages UI state and presents; it delegates the calculation.
export function BookingQuote({ room }: { room: Room }) {
  const [nights, setNights] = useState(1);
  const [weekend, setWeekend] = useState(false);
  const quote = quoteStay(room.pricePerNight, nights, weekend);

  return (
    <div>
      <h3>{room.name}</h3>
      <input aria-label="Nights" type="number" value={nights} onChange={(e) => setNights(Number(e.target.value))} />
      <label>
        <input type="checkbox" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} />
        Includes weekend
      </label>
      {quote.ok ? <p>Price: {quote.price.toFixed(2)} €</p> : <p role="alert">{quote.error}</p>}
    </div>
  );
}
