import { Injectable } from '@angular/core';

export interface D {
  a: number;
  s: string;
  c: string;
}

export interface R {
  n: number;
  t: number;
  x: number;
}

@Injectable({ providedIn: 'root' })
export class SmellyOrderStatsService {
  // SMELL: mysterious names. What is D? What are a, s and c? What does proc compute, and what are
  // n, t and x in the result? The reader has to reverse-engineer every line to find out.
  proc(d: readonly D[], c2: string): R {
    let tmp = 0;
    let t = 0;
    let x = 0;
    for (const i of d) {
      if (i.c !== c2 || i.s === 'X') continue;
      tmp++;
      t += i.a;
      if (i.a > x) x = i.a;
    }
    return { n: tmp, t, x };
  }
}
