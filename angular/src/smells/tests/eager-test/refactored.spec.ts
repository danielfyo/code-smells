import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartStore } from './production';

// REFACTOR: one behavior per test. Each test arranges its own state, names the behavior it
// verifies and fails for exactly one reason.
describe('CartStore (refactored)', () => {
  let cart: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    cart = TestBed.inject(CartStore);
  });

  it('adding the same product twice increases its quantity', () => {
    cart.add('MUG', 8);
    cart.add('MUG', 8);
    expect(cart.items()).toEqual([{ sku: 'MUG', price: 8, quantity: 2 }]);
  });

  it('the total is the sum of price times quantity', () => {
    cart.add('MUG', 8);
    cart.add('MUG', 8);
    cart.add('TEE', 15);
    expect(cart.total()).toBe(31);
  });

  it('removing a product drops all its units', () => {
    cart.add('MUG', 8);
    cart.add('TEE', 15);
    cart.remove('MUG');
    expect(cart.items().map((e) => e.sku)).toEqual(['TEE']);
  });

  it('clearing empties the cart', () => {
    cart.add('MUG', 8);
    cart.clear();
    expect(cart.items()).toEqual([]);
    expect(cart.total()).toBe(0);
  });
});
