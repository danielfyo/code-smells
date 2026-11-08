import { WalletSmelly, describeWithdrawal as smellyDescribe } from './smelly';
import { Wallet, describeWithdrawal } from './refactored';

describe('Returning Error Codes', () => {
  it.each([30, 0, 500])('both versions describe a withdrawal of %i the same way', (amount) => {
    expect(describeWithdrawal(new Wallet(100), amount)).toBe(smellyDescribe(new WalletSmelly(100), amount));
  });

  it('an unchecked smelly error code looks like a valid balance', () => {
    const wallet = new WalletSmelly(100);
    const shownBalance = wallet.withdraw(500); // caller forgot to check
    expect(shownBalance).toBe(-1);
  });

  it('the refactored result cannot be mistaken for a balance', () => {
    const result = new Wallet(100).withdraw(500);
    expect(result).toEqual({ ok: false, error: 'insufficient-funds' });
  });
});
