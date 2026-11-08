import { Injectable } from '@angular/core';

export interface Shipment {
  weightKg: number;
  express: boolean;
  country: string;
}

@Injectable({ providedIn: 'root' })
export class SmellyShippingCostService {
  // SMELL: poorly written comment. Rambling, vague and full of typos; it raises more questions
  // than it answers ("the thing", "like before", "dont ask") and hides the actual rule.
  // calc the shiping, basicaly its the weight thing like before but now w/ the express stuf
  // and also foreign ones r more (not sure how much exactly, ask ops??) dont ask why 5 its legacy
  // NOTE: maybe broken for 0kg?? or not. TODO fix l8r
  cost(s: Shipment): number {
    // here we do the stuff
    let c = 5 + s.weightKg * 1.2;
    // exprs
    if (s.express) c *= 1.5;
    // not local = more $$$ !!!
    if (s.country !== 'ES') c += 10;
    return Math.round(c * 100) / 100;
  }
}
