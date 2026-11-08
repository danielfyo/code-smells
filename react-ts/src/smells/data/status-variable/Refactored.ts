export interface Slot {
  start: string; // "HH:MM"
  booked: boolean;
  room: string;
}

// REFACTOR: Remove Control Flag + Replace Loop with Pipeline. `find` expresses
// "the first one that matches" without flags; the "not found" case is handled
// with `??` instead of another status variable.
const isFreeSlot =
  (room: string, notBefore: string) =>
  (slot: Slot): boolean =>
    slot.room === room && slot.start >= notBefore && !slot.booked;

export function firstFreeSlot(slots: readonly Slot[], room: string, notBefore: string): string {
  return slots.find(isFreeSlot(room, notBefore))?.start ?? "no slot";
}
