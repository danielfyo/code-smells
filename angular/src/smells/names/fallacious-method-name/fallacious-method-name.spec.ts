import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyGiftCardService } from './smelly';
import { GiftCard, GiftCardService } from './refactored';

describe('fallacious-method-name', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('smelly: asking isValid twice changes the answer (it mutates the card)', () => {
    const service = TestBed.inject(SmellyGiftCardService);
    const card = { code: 'GC-1', balance: 50, redeemed: false };
    expect(service.isValid(card)).toBe(true);
    expect(service.isValid(card)).toBe(false);
    expect(card.redeemed).toBe(true);
  });

  it('refactored: the query is repeatable and redeeming is explicit', () => {
    const service = TestBed.inject(GiftCardService);
    const card: GiftCard = { code: 'GC-1', balance: 50, redeemed: false };
    expect(service.isRedeemable(card)).toBe(true);
    expect(service.isRedeemable(card)).toBe(true);
    const redeemed = service.redeem(card);
    expect(card.redeemed).toBe(false);
    expect(service.isRedeemable(redeemed)).toBe(false);
    expect(() => service.redeem(redeemed)).toThrowError(/cannot be redeemed/);
  });

  it('both versions produce the same balance label', () => {
    const card = { code: 'GC-2', balance: 12.5, redeemed: false };
    expect(TestBed.inject(SmellyGiftCardService).getBalance(card)).toBe('12.50 EUR');
    expect(TestBed.inject(GiftCardService).formatBalance(card)).toBe('12.50 EUR');
  });
});
