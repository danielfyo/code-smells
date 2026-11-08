// REFACTOR: Replace Error Code with Exception / Result type. The result is a
// discriminated union with named reasons. TypeScript forces every case to be
// handled (exhaustive check) and it cannot be mistaken for data.
export type ReservationFailure = "unknown-seat" | "seat-taken" | "box-office-closed";

export type ReservationResult = { ok: true; seat: string } | { ok: false; reason: ReservationFailure; seat: string };

export class Theater {
  private readonly taken = new Set<string>();

  constructor(private readonly seats: ReadonlySet<string>) {}

  reserveSeat(seat: string, isOpen: boolean): ReservationResult {
    if (!isOpen) return { ok: false, reason: "box-office-closed", seat };
    if (!this.seats.has(seat)) return { ok: false, reason: "unknown-seat", seat };
    if (this.taken.has(seat)) return { ok: false, reason: "seat-taken", seat };
    this.taken.add(seat);
    return { ok: true, seat };
  }
}

const failureMessages: Record<ReservationFailure, (seat: string) => string> = {
  "unknown-seat": (seat) => `Seat ${seat} does not exist`,
  "seat-taken": (seat) => `Seat ${seat} is already taken`,
  "box-office-closed": () => "The box office is closed",
};

export function reservationMessage(theater: Theater, seat: string, isOpen = true): string {
  const result = theater.reserveSeat(seat, isOpen);
  return result.ok ? `Seat ${result.seat} reserved` : failureMessages[result.reason](result.seat);
}
