// REFACTOR: Replace Inheritance with Interfaces (Push Down Method). Only what every payment
// method can do lives in the shared contract; refunding is a separate capability.
export interface Chargeable {
  readonly label: string;
  charge(cents: number): string;
}

export interface Refundable extends Chargeable {
  refund(cents: number): string;
}

export class CreditCard implements Refundable {
  constructor(readonly label: string) {}

  charge(cents: number): string {
    return `Charged ${cents} to ${this.label}`;
  }

  refund(cents: number): string {
    return `Refunded ${cents} to ${this.label}`;
  }
}

export class GiftCard implements Chargeable {
  constructor(readonly label: string) {}

  charge(cents: number): string {
    return `Charged ${cents} to ${this.label}`;
  }
}

export function isRefundable(method: Chargeable): method is Refundable {
  return 'refund' in method && typeof method.refund === 'function';
}

// REFACTOR: the type system now forces callers to decide what happens with non-refundable
// methods instead of discovering it through a runtime exception.
export function refundOrder(methods: readonly Chargeable[], cents: number): string[] {
  return methods.map((method) =>
    isRefundable(method) ? method.refund(cents) : `Issued store credit of ${cents} for ${method.label}`,
  );
}
