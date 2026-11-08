import { Injectable } from '@angular/core';

export interface GiftCard {
  readonly code: string;
  readonly balance: number;
  readonly redeemed: boolean;
}

@Injectable({ providedIn: 'root' })
export class GiftCardService {
  // REFACTOR: Separate Query from Modifier; Rename Method. The question is a pure predicate,
  // the state change is an explicit command that returns a new card, and the formatter says so.
  isRedeemable(card: GiftCard): boolean {
    return !card.redeemed && card.balance > 0;
  }

  redeem(card: GiftCard): GiftCard {
    if (!this.isRedeemable(card)) throw new Error(`Gift card ${card.code} cannot be redeemed`);
    return { ...card, redeemed: true };
  }

  formatBalance(card: GiftCard): string {
    return `${card.balance.toFixed(2)} EUR`;
  }
}
