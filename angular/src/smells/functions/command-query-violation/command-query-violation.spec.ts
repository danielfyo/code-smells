import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VoucherBookSmelly } from './smelly';
import { VoucherBook } from './refactored';

describe('Command-Query Separation Violation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('asking the smelly question twice gives two different answers', () => {
    const book = TestBed.inject(VoucherBookSmelly);
    expect(book.checkVoucher('SPRING10')).toBe(true);
    expect(book.checkVoucher('SPRING10')).toBe(false);
  });

  it('the refactored query is stable until the command runs', () => {
    const book = TestBed.inject(VoucherBook);
    expect(book.isRedeemable('SPRING10')).toBe(true);
    expect(book.isRedeemable('SPRING10')).toBe(true);
    book.redeem('SPRING10');
    expect(book.isRedeemable('SPRING10')).toBe(false);
    expect(() => book.redeem('SPRING10')).toThrow('cannot be redeemed');
  });

  it('a "check then redeem" flow ends in the same state in both versions', () => {
    const smelly = TestBed.inject(VoucherBookSmelly);
    const book = TestBed.inject(VoucherBook);
    smelly.checkVoucher('VIP25');
    if (book.isRedeemable('VIP25')) book.redeem('VIP25');
    expect(book.isRedeemable('VIP25')).toBe(false);
    expect(smelly.checkVoucher('VIP25')).toBe(false);
  });
});
