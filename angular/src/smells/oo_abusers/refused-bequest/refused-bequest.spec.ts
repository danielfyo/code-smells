import { CreditCardSmelly, GiftCardSmelly, refundOrder as smellyRefund } from './smelly';
import { CreditCard, GiftCard, refundOrder } from './refactored';

describe('Refused Bequest', () => {
  it('both versions charge in the same way', () => {
    expect(new GiftCard('Gift 01').charge(500)).toBe(new GiftCardSmelly('Gift 01').charge(500));
    expect(new CreditCard('Visa').refund(500)).toBe(new CreditCardSmelly('Visa').refund(500));
  });

  it('the smelly subclass breaks code written against the base class', () => {
    expect(() => smellyRefund([new CreditCardSmelly('Visa'), new GiftCardSmelly('Gift 01')], 500)).toThrow(
      'Gift cards cannot be refunded',
    );
  });

  it('the refactored version handles every method explicitly', () => {
    expect(refundOrder([new CreditCard('Visa'), new GiftCard('Gift 01')], 500)).toEqual([
      'Refunded 500 to Visa',
      'Issued store credit of 500 for Gift 01',
    ]);
  });
});
