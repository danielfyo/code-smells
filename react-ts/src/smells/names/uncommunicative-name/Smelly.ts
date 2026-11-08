// SMELL: uncommunicative names: d, tmp, data2, proc, x... reveal nothing about intent.
export interface Data2 {
  n: string;
  d: string; // SMELL: is "d" a date, a discount, a description...?
  a: number;
}

export function proc(data2: Data2[], x: string): number {
  let tmp = 0;
  for (const d of data2) {
    if (d.d.startsWith(x)) tmp += d.a;
  }
  return tmp;
}
