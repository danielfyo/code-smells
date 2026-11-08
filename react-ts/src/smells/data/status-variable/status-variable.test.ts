import { firstFreeSlot as smelly } from "./Smelly";
import { firstFreeSlot as refactored } from "./Refactored";

const slots = [
  { start: "09:00", booked: false, room: "A" },
  { start: "10:00", booked: true, room: "A" },
  { start: "10:00", booked: false, room: "B" },
  { start: "11:00", booked: false, room: "A" },
];

describe("Status Variable", () => {
  it.each([
    ["A", "08:00", "09:00"],
    ["A", "09:30", "11:00"],
    ["B", "10:30", "no slot"],
    ["C", "00:00", "no slot"],
  ])("room %s from %s → %s", (room, notBefore, expected) => {
    expect(smelly(slots, room, notBefore)).toBe(expected);
    expect(refactored(slots, room, notBefore)).toBe(expected);
  });
});
