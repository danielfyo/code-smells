// REFACTOR: Replace Inheritance with Delegation + Extract Interface. Only what
// is truly common (`Spendable`) is shared; each class implements the contract
// it can honour and the compiler prevents invalid usages.
export interface Spendable {
  readonly id: string;
  getBalance(): number;
  withdraw(amount: number): void;
}

export interface Fundable {
  deposit(amount: number): void;
}

// REFACTOR: the balance logic is extracted into a component reused by delegation.
class Balance {
  constructor(private amount: number) {}
  get value(): number {
    return this.amount;
  }
  add(amount: number): void {
    this.amount += amount;
  }
  subtract(amount: number): void {
    if (amount > this.amount) throw new Error("Insufficient funds");
    this.amount -= amount;
  }
}

export class BankAccount implements Spendable, Fundable {
  private readonly balance: Balance;
  constructor(
    readonly id: string,
    initial: number,
  ) {
    this.balance = new Balance(initial);
  }
  getBalance(): number {
    return this.balance.value;
  }
  deposit(amount: number): void {
    this.balance.add(amount);
  }
  withdraw(amount: number): void {
    this.balance.subtract(amount);
  }
  transferTo(target: Fundable, amount: number): void {
    this.withdraw(amount);
    target.deposit(amount);
  }
}

export class GiftCard implements Spendable {
  private readonly balance: Balance;
  constructor(
    readonly id: string,
    initial: number,
  ) {
    this.balance = new Balance(initial);
  }
  getBalance(): number {
    return this.balance.value;
  }
  withdraw(amount: number): void {
    this.balance.subtract(amount);
  }
}

// REFACTOR: the client asks only for what it needs: any `Spendable` will do.
export function payAll(sources: Spendable[], target: Fundable, amount: number): void {
  for (const source of sources) {
    source.withdraw(amount);
    target.deposit(amount);
  }
}
