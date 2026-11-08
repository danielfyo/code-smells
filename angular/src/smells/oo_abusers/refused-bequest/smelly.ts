// SMELL: Refused Bequest. GiftCard inherits `refund()` from PaymentMethod but cannot honor it,
// so it throws. Any code that treats "a PaymentMethod" polymorphically can now blow up: the
// subclass is not substitutable for its base (Liskov Substitution Principle).
export abstract class PaymentMethodSmelly {
  protected balanceCents = 0;

  constructor(readonly label: string) {}

  charge(cents: number): string {
    this.balanceCents += cents;
    return `Charged ${cents} to ${this.label}`;
  }

  refund(cents: number): string {
    this.balanceCents -= cents;
    return `Refunded ${cents} to ${this.label}`;
  }
}

export class CreditCardSmelly extends PaymentMethodSmelly {}

export class GiftCardSmelly extends PaymentMethodSmelly {
  override refund(): string {
    throw new Error('Gift cards cannot be refunded');
  }
}

export function refundOrder(methods: PaymentMethodSmelly[], cents: number): string[] {
  return methods.map((method) => method.refund(cents));
}
