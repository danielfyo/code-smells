import { useState } from "react";

export interface Guest {
  id: string;
  name: string;
}

// SMELL: index as key in a list that gets reordered. React ties internal state (the text
// typed in each uncontrolled <input>) to the position, not to the guest: when the list
// is reversed the notes stay in place and end up next to the wrong guest.
export function GuestList({ initialGuests }: { initialGuests: Guest[] }) {
  const [guests, setGuests] = useState(initialGuests);

  return (
    <div>
      <button onClick={() => setGuests((g) => [...g].reverse())}>Reverse</button>
      <ul>
        {guests.map((guest, index) => (
          <li key={index}>
            <label>
              {guest.name}
              <input aria-label={`Note for ${guest.name}`} defaultValue="" />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
