// SMELL: Returning Error Codes. The same number channel carries both the new balance and
// failure codes (-1, -2). Callers must remember the table and check every result; forgetting
// to do so turns an error into a "balance" of -1.
export const INSUFFICIENT_FUNDS = -1;
export const INVALID_AMOUNT = -2;

export class WalletSmelly {
  constructor(public balance: number) {}

  withdraw(amount: number): number {
    if (amount <= 0) return INVALID_AMOUNT;
    if (amount > this.balance) return INSUFFICIENT_FUNDS;
    this.balance -= amount;
    return this.balance;
  }
}

export function describeWithdrawal(wallet: WalletSmelly, amount: number): string {
  const result = wallet.withdraw(amount);
  if (result === INSUFFICIENT_FUNDS) return 'Insufficient funds';
  if (result === INVALID_AMOUNT) return 'Invalid amount';
  return `New balance: ${result}`;
}
