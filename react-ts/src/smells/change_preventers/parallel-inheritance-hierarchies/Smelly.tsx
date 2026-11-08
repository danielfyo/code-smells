// SMELL: Parallel Inheritance Hierarchies. For every `PaymentMethod` subclass
// we must create its "twin" in the hierarchy of summary components and add one
// more branch to the selector. Both hierarchies always grow together.
export abstract class PaymentMethod {
  constructor(readonly amount: number) {}
  abstract fee(): number;
}

export class CardPayment extends PaymentMethod {
  constructor(amount: number, readonly last4: string) {
    super(amount);
  }
  fee(): number {
    return this.amount * 0.015;
  }
}

export class BankTransfer extends PaymentMethod {
  constructor(amount: number, readonly iban: string) {
    super(amount);
  }
  fee(): number {
    return 0.35;
  }
}

// SMELL: a parallel hierarchy of components, one per payment class.
function CardPaymentSummary({ payment }: { payment: CardPayment }) {
  return (
    <p>
      Card •••• {payment.last4} — fee {payment.fee().toFixed(2)} €
    </p>
  );
}

function BankTransferSummary({ payment }: { payment: BankTransfer }) {
  return (
    <p>
      Transfer to {payment.iban.slice(0, 4)}… — fee {payment.fee().toFixed(2)} €
    </p>
  );
}

// SMELL: plus a selector that wires both hierarchies together with instanceof.
export function PaymentSummary({ payment }: { payment: PaymentMethod }) {
  if (payment instanceof CardPayment) return <CardPaymentSummary payment={payment} />;
  if (payment instanceof BankTransfer) return <BankTransferSummary payment={payment} />;
  return null;
}
