export interface Shipment {
  weightKg: number;
  zone: "local" | "national" | "international";
  express: boolean;
}

// SMELL: one-letter names (s, r, t, w, c) that live across the whole function.
// By line 20 nobody remembers what "r" or "c" was.
export function shippingReport(s: Shipment[]): { total: number; heavy: number; express: number } {
  let t = 0;
  let w = 0;
  let c = 0;
  for (const x of s) {
    let r = x.zone === "local" ? 3 : x.zone === "national" ? 6 : 15;
    if (x.weightKg > 10) {
      r += (x.weightKg - 10) * 0.5;
      w++;
    }
    if (x.express) {
      r *= 1.5;
      c++;
    }
    t += r;
  }
  return { total: Math.round(t * 100) / 100, heavy: w, express: c };
}
