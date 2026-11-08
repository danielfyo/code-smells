import { ChangeDetectionStrategy, Component, Injectable, computed, inject, input } from '@angular/core';

export interface CafeCustomer {
  readonly name: string;
  readonly stamps: number;
  readonly discountRate: number;
}

const FREE_COFFEE_STAMPS = 9;

// REFACTOR: Introduce Special Case (Null Object). A guest is a real customer value with neutral
// behavior, so no consumer ever has to check for null.
export const GUEST: CafeCustomer = { name: 'guest', stamps: 0, discountRate: 0 };

@Injectable({ providedIn: 'root' })
export class CustomerDirectory {
  private readonly customers = new Map<string, CafeCustomer>([['C-7', { name: 'Elena', stamps: 9, discountRate: 0.1 }]]);

  find(card: string): CafeCustomer {
    return this.customers.get(card) ?? GUEST;
  }
}

@Component({
  selector: 'cs-null-abuse-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p>Hello {{ customer().name }}</p>
    <p>Total: {{ total().toFixed(2) }} €</p>
    <p>{{ freeCoffee() ? 'Next coffee is free!' : 'Collect stamps for free coffee' }}</p>
  `,
})
export class TillRefactored {
  readonly card = input('');
  readonly amount = input(0);
  private readonly directory = inject(CustomerDirectory);

  protected readonly customer = computed(() => this.directory.find(this.card()));
  protected readonly total = computed(() => this.amount() * (1 - this.customer().discountRate));
  protected readonly freeCoffee = computed(() => this.customer().stamps >= FREE_COFFEE_STAMPS);
}
