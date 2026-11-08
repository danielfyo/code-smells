import { Injectable } from '@angular/core';

// SMELL: Command-Query Separation Violation. `checkVoucher` reads like a question but it also
// marks the voucher as used. Checking twice (e.g. once to enable a button, once on submit)
// gives two different answers.
@Injectable({ providedIn: 'root' })
export class VoucherBookSmelly {
  private readonly unused = new Set(['SPRING10', 'VIP25']);

  checkVoucher(code: string): boolean {
    const valid = this.unused.has(code);
    if (valid) {
      this.unused.delete(code);
    }
    return valid;
  }
}
