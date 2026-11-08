import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyCartSessionService } from './smelly';
import { CartSessionService } from './refactored';

describe('names-hiding-side-effects', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it('smelly: a mere "get" writes a cart to storage', () => {
    expect(sessionStorage.getItem('cart')).toBeNull();
    TestBed.inject(SmellyCartSessionService).getCart();
    expect(sessionStorage.getItem('cart')).not.toBeNull();
  });

  it('refactored: findCart is a pure query, getOrCreateCart names the write', () => {
    const service = TestBed.inject(CartSessionService);
    expect(service.findCart()).toBeNull();
    expect(sessionStorage.getItem('cart')).toBeNull();
    expect(service.getOrCreateCart()).toEqual({ id: 'cart-1', items: [] });
    expect(service.findCart()).toEqual({ id: 'cart-1', items: [] });
  });

  it('both versions return the same cart on repeated calls', () => {
    const smelly = TestBed.inject(SmellyCartSessionService);
    expect(smelly.getCart()).toEqual(smelly.getCart());
    sessionStorage.clear();
    const refactored = TestBed.inject(CartSessionService);
    expect(refactored.getOrCreateCart()).toEqual(refactored.getOrCreateCart());
  });
});
