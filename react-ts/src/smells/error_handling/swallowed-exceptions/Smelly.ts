export interface Ledger {
  balances: Map<string, number>;
  frozen: Set<string>;
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

// SMELL: Swallowed Exceptions. The empty `catch` swallows any error. If the
// credit fails AFTER the debit, the money vanishes: the system is left
// inconsistent and the caller believes everything went fine.
export function transfer(ledger: Ledger, from: string, to: string, amount: number): void {
  try {
    debit(ledger, from, amount);
    credit(ledger, to, amount);
  } catch {
    // ignore: "we will look into it later"
  }
}
