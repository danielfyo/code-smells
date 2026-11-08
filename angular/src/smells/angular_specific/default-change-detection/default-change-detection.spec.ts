import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Product, SmellyProductCardComponent } from './smelly';
import { ProductCardComponent } from './refactored';

@Component({
  selector: 'cs-default-change-detection-host',
  imports: [SmellyProductCardComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="clicks.set(clicks() + 1)">Clicked {{ clicks() }}</button>
    <cs-default-change-detection-smelly [product]="product()" />
    <cs-default-change-detection-refactored [product]="product()" />
  `,
})
class DefaultChangeDetectionHost {
  readonly clicks = signal(0);
  readonly product = signal<Product>({ name: 'Kettle', price: 25 });
  readonly smelly = viewChild.required(SmellyProductCardComponent);
  readonly refactored = viewChild.required(ProductCardComponent);
}

describe('default-change-detection', () => {
  async function setup() {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture = TestBed.createComponent(DefaultChangeDetectionHost);
    await fixture.whenStable();
    return fixture;
  }

  it('both cards render the same product', async () => {
    const fixture = await setup();
    const cards = [...(fixture.nativeElement as HTMLElement).querySelectorAll('.card')].map((c) => c.textContent);
    expect(cards).toEqual(['Kettle - 25 EUR', 'Kettle - 25 EUR']);
  });

  it('an unrelated change in the parent re-renders only the eager card', async () => {
    const fixture = await setup();
    const host = fixture.componentInstance;
    const smellyBefore = host.smelly().renders;
    const refactoredBefore = host.refactored().renders;

    for (let i = 0; i < 3; i++) {
      (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
      await fixture.whenStable();
    }

    expect(host.smelly().renders).toBeGreaterThanOrEqual(smellyBefore + 3);
    expect(host.refactored().renders).toBe(refactoredBefore);
  });

  it('a new input reference re-renders the OnPush card too', async () => {
    const fixture = await setup();
    const before = fixture.componentInstance.refactored().renders;
    fixture.componentInstance.product.set({ name: 'Kettle', price: 22 });
    await fixture.whenStable();
    expect(fixture.componentInstance.refactored().renders).toBeGreaterThan(before);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('.card')[1]?.textContent).toBe('Kettle - 22 EUR');
  });
});
