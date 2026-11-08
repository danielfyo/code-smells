import { useState } from "react";

export interface Room {
  name: string;
  pricePerNight: number;
}

// SMELL: business logic inside the component. Pricing rules (weekend, long stay, minimum
// nights) are mixed with the JSX and UI state. They can't be tested without rendering
// nor reused elsewhere (the email, the API...).
export function BookingQuote({ room }: { room: Room }) {
  const [nights, setNights] = useState(1);
  const [weekend, setWeekend] = useState(false);

  let price = room.pricePerNight * nights;
  if (weekend) price = price * 1.2;
  if (nights >= 7) price = price - price * 0.15;
  const error = nights < 1 ? "Minimum one night" : null;

  return (
    <div>
      <h3>{room.name}</h3>
      <input aria-label="Nights" type="number" value={nights} onChange={(e) => setNights(Number(e.target.value))} />
      <label>
        <input type="checkbox" checked={weekend} onChange={(e) => setWeekend(e.target.checked)} />
        Includes weekend
      </label>
      {error ? <p role="alert">{error}</p> : <p>Price: {price.toFixed(2)} €</p>}
    </div>
  );
}
