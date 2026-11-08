export interface Reservation {
  readonly guest: string;
  readonly seats: number;
}

// REFACTOR: Encapsulate Field / Hide Method. The public interface is minimal
// (book, seatsAvailable, list); state and internal calculations are private.
export class RestaurantBookings {
  readonly #reservations: Reservation[] = [];

  constructor(private readonly capacity: number) {}

  get seatsAvailable(): number {
    return this.capacity - this.#seatsTaken();
  }

  // REFACTOR: return a read-only copy, not the internal collection.
  list(): readonly Reservation[] {
    return [...this.#reservations];
  }

  book(guest: string, seats: number): boolean {
    if (seats > this.seatsAvailable) return false;
    this.#reservations.push({ guest, seats });
    return true;
  }

  // REFACTOR: the derived value is computed, not stored: it can't get out of sync.
  #seatsTaken(): number {
    return this.#reservations.reduce((sum, r) => sum + r.seats, 0);
  }
}
