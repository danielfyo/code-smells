// SMELL: Returning Error Codes. `reserveSeat` returns 0, -1, -2 or -3. The
// caller has to know what each number means, nothing forces it to check, and
// it is easy to mistake an error code for valid data.
export class Theater {
  private taken = new Set<string>();

  constructor(private readonly seats: ReadonlySet<string>) {}

  reserveSeat(seat: string, isOpen: boolean): number {
    if (!isOpen) return -3;
    if (!this.seats.has(seat)) return -1;
    if (this.taken.has(seat)) return -2;
    this.taken.add(seat);
    return 0;
  }
}

// SMELL: a translation table for "magic numbers", far away from their source.
export function reservationMessage(theater: Theater, seat: string, isOpen = true): string {
  const code = theater.reserveSeat(seat, isOpen);
  if (code === 0) return `Seat ${seat} reserved`;
  if (code === -1) return `Seat ${seat} does not exist`;
  if (code === -2) return `Seat ${seat} is already taken`;
  return "The box office is closed";
}
