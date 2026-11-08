// REFACTOR: Move Method + Collapse Hierarchy. Each payment method knows how to
// describe itself (`label()`), so the parallel hierarchy of components
// disappears: a single component works for every type.
export abstract class PaymentMethod {
  constructor(readonly amount: number) {}
  abstract fee(): number;
  abstract label(): string;
}

export class CardPayment extends PaymentMethod {
  constructor(amount: number, readonly last4: string) {
    super(amount);
  }
  fee(): number {
    return this.amount * 0.015;
  }
  label(): string {
    return `Card •••• ${this.last4}`;
  }
}

export class BankTransfer extends PaymentMethod {
  constructor(amount: number, readonly iban: string) {
    super(amount);
  }
  fee(): number {
    return 0.35;
  }
  label(): string {
    return `Transfer to ${this.iban.slice(0, 4)}…`;
  }
}

// REFACTOR: one generic component; adding "Wallet" now only requires a new class.
export function PaymentSummary({ payment }: { payment: PaymentMethod }) {
  return (
    <p>
      {payment.label()} — fee {payment.fee().toFixed(2)} €
    </p>
  );
}
