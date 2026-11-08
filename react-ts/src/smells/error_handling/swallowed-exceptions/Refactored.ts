export interface Ledger {
  balances: Map<string, number>;
  frozen: Set<string>;
}

export class TransferError extends Error {
  constructor(message: string, cause: unknown) {
    super(message, { cause });
    this.name = "TransferError";
  }
}

function debit(ledger: Ledger, account: string, amount: number): void {
  const balance = ledger.balances.get(account) ?? 0;
  if (balance < amount) throw new Error("Insufficient funds");
  ledger.balances.set(account, balance - amount);
}

function credit(ledger: Ledger, account: string, amount: number): void {
  if (ledger.frozen.has(account)) throw new Error(`Account ${account} is frozen`);
  ledger.balances.set(account, (ledger.balances.get(account) ?? 0) + amount);
}

// REFACTOR: Fail Fast + compensating action. If the credit fails the debit is
// undone (the system returns to a consistent state) and the error is propagated
// with context, so the caller can decide what to do.
export function transfer(ledger: Ledger, from: string, to: string, amount: number): void {
  debit(ledger, from, amount); // if it fails here, there is nothing to undo yet
  try {
    credit(ledger, to, amount);
  } catch (error) {
    credit(ledger, from, amount); // compensation
    throw new TransferError(`Could not transfer ${amount} from ${from} to ${to}`, error);
  }
}
