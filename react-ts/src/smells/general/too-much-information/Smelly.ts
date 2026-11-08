// SMELL: too much information / indecent exposure. Everything is public: the internal
// array, the counters and the helpers. Anyone can break the invariants from outside.
export interface Reservation {
  guest: string;
  seats: number;
}

export class RestaurantBookings {
  public capacity: number;
  public reservations: Reservation[] = []; // SMELL: mutable internal state exposed.
  public seatsTaken = 0; // SMELL: derived value that can get out of sync.

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  // SMELL: internal helper published as part of the API.
  public recalculateSeats(): void {
    this.seatsTaken = this.reservations.reduce((sum, r) => sum + r.seats, 0);
  }

  public book(guest: string, seats: number): boolean {
    if (this.seatsTaken + seats > this.capacity) return false;
    this.reservations.push({ guest, seats });
    this.recalculateSeats();
    return true;
  }
}
