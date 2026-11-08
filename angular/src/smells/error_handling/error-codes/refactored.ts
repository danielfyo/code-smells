// REFACTOR: Replace Error Code with an explicit result type. Success and each failure are
// distinct shapes; the compiler forces callers to look at `ok` before touching the balance.
export type WithdrawalError = 'insufficient-funds' | 'invalid-amount';

export type WithdrawalResult = { ok: true; balance: number } | { ok: false; error: WithdrawalError };

export class Wallet {
  constructor(private balanceValue: number) {}

  get balance(): number {
    return this.balanceValue;
  }

  withdraw(amount: number): WithdrawalResult {
    if (amount <= 0) return { ok: false, error: 'invalid-amount' };
    if (amount > this.balanceValue) return { ok: false, error: 'insufficient-funds' };
    this.balanceValue -= amount;
    return { ok: true, balance: this.balanceValue };
  }
}

const ERROR_MESSAGES: Record<WithdrawalError, string> = {
  'insufficient-funds': 'Insufficient funds',
  'invalid-amount': 'Invalid amount',
};

export function describeWithdrawal(wallet: Wallet, amount: number): string {
  const result = wallet.withdraw(amount);
  return result.ok ? `New balance: ${result.balance}` : ERROR_MESSAGES[result.error];
}
