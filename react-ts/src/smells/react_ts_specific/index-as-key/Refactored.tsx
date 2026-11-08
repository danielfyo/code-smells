import { useState } from "react";

export interface Guest {
  id: string;
  name: string;
}

// REFACTOR: a stable key derived from the item's identity (guest.id). React moves the DOM
// node and its state along with the guest when reordering, inserting or deleting.
export function GuestList({ initialGuests }: { initialGuests: Guest[] }) {
  const [guests, setGuests] = useState(initialGuests);

  return (
    <div>
      <button onClick={() => setGuests((g) => [...g].reverse())}>Reverse</button>
      <ul>
        {guests.map((guest) => (
          <li key={guest.id}>
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
