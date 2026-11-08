// SMELL: Status Variable. `found` and `done` are flags whose only job is to steer the loops.
// The reader has to simulate them in their head to know when the search stops and what it returns.
export function firstAdjacentFreeSeats(row: readonly boolean[], needed: number): number {
  let found = false;
  let done = false;
  let result = -1;
  let i = 0;
  while (!done && i <= row.length - needed) {
    let allFree = true;
    for (let j = i; j < i + needed; j++) {
      if (row[j]) {
        allFree = false;
      }
    }
    if (allFree) {
      found = true;
      result = i;
      done = true;
    }
    i++;
  }
  if (!found) {
    result = -1;
  }
  return result;
}
