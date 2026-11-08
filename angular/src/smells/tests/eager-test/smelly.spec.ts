import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartStore } from './production';

// SMELL: eager test. One test exercises adding, merging quantities, totals, removing and
// clearing. Its name cannot describe what it checks, a failure in step 2 hides steps 3-5, and
// each step depends on the state left by the previous one.
describe('CartStore (smelly)', () => {
  it('cart works', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const cart = TestBed.inject(CartStore);
    cart.add('MUG', 8);
    cart.add('MUG', 8);
    cart.add('TEE', 15);
    expect(cart.items()).toHaveLength(2);
    expect(cart.items()[0]?.quantity).toBe(2);
    expect(cart.total()).toBe(31);
    cart.remove('MUG');
    expect(cart.total()).toBe(15);
    cart.clear();
    expect(cart.items()).toEqual([]);
  });
});
