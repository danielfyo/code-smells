import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasketLine, SmellyBasketComponent } from './smelly';
import { BasketComponent } from './refactored';

const lines: BasketLine[] = [
  { product: 'Headphones', price: 120, quantity: 1 },
  { product: 'Cable', price: 10, quantity: 3 },
];

async function toggleThemeTimes(fixture: ComponentFixture<SmellyBasketComponent | BasketComponent>, times: number) {
  for (let i = 0; i < times; i++) {
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.theme')?.click();
    await fixture.whenStable();
  }
}

describe('function-calls-in-template', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  it.each([SmellyBasketComponent, BasketComponent])('%o renders the same totals', async (component) => {
    const fixture = TestBed.createComponent<SmellyBasketComponent | BasketComponent>(component);
    fixture.componentInstance.lines.set(lines);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.total')?.textContent).toBe('Total: 150 EUR');
    expect(host.querySelector('.count')?.textContent).toBe('1 premium items');
  });

  it('smelly: the methods run again on every change detection, even for unrelated changes', async () => {
    const fixture = TestBed.createComponent(SmellyBasketComponent);
    fixture.componentInstance.lines.set(lines);
    await fixture.whenStable();
    const afterFirstRender = fixture.componentInstance.computations;
    await toggleThemeTimes(fixture, 5);
    expect(fixture.componentInstance.computations).toBeGreaterThanOrEqual(afterFirstRender + 10);
  });

  it('refactored: computed values are calculated once until their inputs change', async () => {
    const fixture = TestBed.createComponent(BasketComponent);
    fixture.componentInstance.lines.set(lines);
    await fixture.whenStable();
    expect(fixture.componentInstance.computations).toBe(2);
    await toggleThemeTimes(fixture, 5);
    expect(fixture.componentInstance.computations).toBe(2);
    fixture.componentInstance.lines.update((current) => [...current, { product: 'Mouse', price: 25, quantity: 1 }]);
    await fixture.whenStable();
    expect(fixture.componentInstance.computations).toBe(4);
  });
});
