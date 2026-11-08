// SMELL: Refused Bequest. `GiftCard` extends `BankAccount` only to reuse the
// balance, but refuses half of the inheritance (deposits and transfers) by
// throwing. Whoever receives a `BankAccount` can no longer trust its contract (LSP).
export class BankAccount {
  constructor(
    readonly id: string,
    protected balance: number,
  ) {}

  getBalance(): number {
    return this.balance;
  }

  deposit(amount: number): void {
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  transferTo(target: BankAccount, amount: number): void {
    this.withdraw(amount);
    target.deposit(amount);
  }
}

export class GiftCard extends BankAccount {
  override deposit(): void {
    // SMELL: the child "refuses" the inherited method.
    throw new Error("A gift card cannot be topped up");
  }

  override transferTo(): void {
    throw new Error("A gift card does not support transfers");
  }
}

// SMELL: this client code, written for BankAccount, blows up with a GiftCard.
export function payAll(sources: BankAccount[], target: BankAccount, amount: number): void {
  for (const source of sources) source.transferTo(target, amount);
}
