import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SmellyCartComponent } from './smelly';
import { CartComponent } from './refactored';

describe('redundant-comment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each([SmellyCartComponent, CartComponent])('%o counts items and totals the cart', async (component) => {
    const fixture = TestBed.createComponent<SmellyCartComponent | CartComponent>(component);
    const host = fixture.nativeElement as HTMLElement;
    fixture.componentInstance.add({ sku: 'MUG', price: 8, quantity: 2 });
    fixture.componentInstance.add({ sku: 'TEE', price: 15, quantity: 1 });
    await fixture.whenStable();
    expect(host.querySelector('.count')?.textContent).toBe('3');
    expect(host.querySelector('.total')?.textContent).toBe('31');

    fixture.componentInstance.clear();
    await fixture.whenStable();
    expect(host.querySelector('.count')?.textContent).toBe('0');
  });
});
