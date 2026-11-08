export interface Slot {
  start: string; // "HH:MM"
  booked: boolean;
  room: string;
}

// SMELL: Status Variable. `found`, `done` and `result` are mutable flags that
// control the loop's flow. To understand when it ends you have to trace by hand
// how all three change on every iteration.
export function firstFreeSlot(slots: Slot[], room: string, notBefore: string): string {
  let found = false;
  let done = false;
  let result = "";
  let i = 0;
  while (!done && i < slots.length) {
    const slot = slots[i];
    if (slot.room === room) {
      if (slot.start >= notBefore) {
        if (!slot.booked) {
          found = true;
          result = slot.start;
          done = true;
        }
      }
    }
    i++;
  }
  if (!found) {
    result = "no slot";
  }
  return result;
}
