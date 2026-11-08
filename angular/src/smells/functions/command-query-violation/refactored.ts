import { Injectable, signal } from '@angular/core';

// REFACTOR: Separate Query from Modifier. `isRedeemable` only answers; `redeem` only acts (and
// refuses loudly when it cannot), so callers can ask as often as they like.
@Injectable({ providedIn: 'root' })
export class VoucherBook {
  private readonly unused = signal<ReadonlySet<string>>(new Set(['SPRING10', 'VIP25']));

  isRedeemable(code: string): boolean {
    return this.unused().has(code);
  }

  redeem(code: string): void {
    if (!this.isRedeemable(code)) {
      throw new Error(`Voucher ${code} cannot be redeemed`);
    }
    this.unused.update((codes) => new Set([...codes].filter((c) => c !== code)));
  }
}
