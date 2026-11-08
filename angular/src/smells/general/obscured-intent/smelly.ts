import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface Product {
  name: string;
  price: number;
  stock: number;
  tags: string[];
}

@Component({
  selector: 'cs-obscured-intent-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="sale">{{ s().n }} on sale, {{ s().t.toFixed(2) }} EUR</p>
    <p class="alert">{{ l() ? 'Low stock!' : 'Stock OK' }}</p>
  `,
})
export class SmellySaleSummaryComponent {
  readonly p = input.required<Product[]>();

  // SMELL: obscured intent. A "clever" one-liner with bitwise NOT on indexOf, the comma operator,
  // short-circuit side effects and unary plus. It works, but nobody can tell what it computes.
  readonly s = computed(() =>
    this.p().reduce((a, x) => (x.stock && ~x.tags.indexOf('sale') && (a.n++, (a.t += +x.price * 0.8)), a), { n: 0, t: 0 }),
  );

  // SMELL: boolean arithmetic and double negation for "is any product running out?".
  readonly l = computed(() => !!this.p().filter((x) => +(x.stock < 5) & +(x.stock > 0)).length);
}
