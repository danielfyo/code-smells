import * as Smelly from "./Smelly";
import * as Refactored from "./Refactored";

const seats = new Set(["A1", "A2"]);

describe("Returning Error Codes", () => {
  it("produce the same messages in the same sequence", () => {
    const s = new Smelly.Theater(seats);
    const r = new Refactored.Theater(seats);
    const steps: [string, boolean][] = [
      ["A1", true],
      ["A1", true],
      ["Z9", true],
      ["A2", false],
    ];
    const smelly = steps.map(([seat, open]) => Smelly.reservationMessage(s, seat, open));
    const refactored = steps.map(([seat, open]) => Refactored.reservationMessage(r, seat, open));
    expect(refactored).toEqual(smelly);
    expect(refactored).toEqual([
      "Seat A1 reserved",
      "Seat A1 is already taken",
      "Seat Z9 does not exist",
      "The box office is closed",
    ]);
  });

  it("the error code can be ignored without anyone noticing", () => {
    const theater = new Smelly.Theater(seats);
    const total = theater.reserveSeat("Z9", true) + 10; // arithmetic with an error code
    expect(total).toBe(9);
  });

  it("the typed result exposes a named reason", () => {
    expect(new Refactored.Theater(seats).reserveSeat("Z9", true)).toEqual({ ok: false, reason: "unknown-seat", seat: "Z9" });
  });
});
