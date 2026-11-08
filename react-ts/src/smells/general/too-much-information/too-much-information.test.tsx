import { RestaurantBookings as Smelly } from "./Smelly";
import { RestaurantBookings as Refactored } from "./Refactored";

describe("too-much-information", () => {
  it("both versions respect capacity", () => {
    const smelly = new Smelly(10);
    const refactored = new Refactored(10);
    expect(smelly.book("Anna", 6)).toBe(true);
    expect(refactored.book("Anna", 6)).toBe(true);
    expect(smelly.book("Luke", 5)).toBe(false);
    expect(refactored.book("Luke", 5)).toBe(false);
    expect(refactored.seatsAvailable).toBe(4);
  });

  it("smelly lets outside code break the invariant", () => {
    const smelly = new Smelly(10);
    smelly.book("Anna", 6);
    smelly.reservations.length = 0; // nothing prevents it
    expect(smelly.seatsTaken).toBe(6); // and the counter lies
  });

  it("refactored does not expose its internal state", () => {
    const refactored = new Refactored(10);
    refactored.book("Anna", 6);
    const copy = refactored.list() as Array<{ guest: string; seats: number }>;
    copy.length = 0;
    expect(refactored.list()).toHaveLength(1);
  });
});
