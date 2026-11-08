// SMELL: Comments (as Deodorant). The comments are needed only because the names and the
// structure say nothing. Rename and extract, and the comments become unnecessary.

// calculates the points
export function calc(a: number, t: string, m: number): number {
  // p = points
  let p = Math.floor(a / 10); // 1 point every 10 euros
  // check tier: G is gold, S is silver
  if (t === 'G') {
    p = p * 2; // gold doubles
  } else if (t === 'S') {
    p = Math.round(p * 1.5); // silver gets 50% more
  }
  // m is the number of months as a member; after 24 months add 20 extra points
  if (m >= 24) {
    p += 20;
  }
  return p;
}
