import { Injectable } from '@angular/core';

export interface GiftCard {
  code: string;
  balance: number;
  redeemed: boolean;
}

@Injectable({ providedIn: 'root' })
export class SmellyGiftCardService {
  // SMELL: fallacious method name. `isValid` promises a yes/no question, but it also marks the
  // card as redeemed. Asking twice gives a different answer, and a template or a log line that
  // "just checks" burns the customer's card.
  isValid(card: GiftCard): boolean {
    if (card.redeemed || card.balance <= 0) return false;
    card.redeemed = true;
    return true;
  }

  // SMELL: `getBalance` does not return the balance: it returns a formatted label.
  getBalance(card: GiftCard): string {
    return `${card.balance.toFixed(2)} EUR`;
  }
}
