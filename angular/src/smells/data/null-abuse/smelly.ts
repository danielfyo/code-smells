import { Component, Injectable, Input, inject } from '@angular/core';

export interface CafeCustomer {
  name: string;
  stamps: number;
  discountRate: number;
}

// SMELL: Null Abuse. The lookup returns null for walk-in customers and every consumer must
// remember to check it: in the template, in the price calculation, in the loyalty message.
@Injectable({ providedIn: 'root' })
export class CustomerDirectorySmelly {
  private readonly customers = new Map<string, CafeCustomer>([['C-7', { name: 'Elena', stamps: 9, discountRate: 0.1 }]]);

  find(card: string): CafeCustomer | null {
    return this.customers.get(card) ?? null;
  }
}

@Component({
  selector: 'cs-null-abuse-smelly',
  template: `
    <p>Hello {{ customer !== null ? customer.name : 'guest' }}</p>
    <p>Total: {{ total().toFixed(2) }} €</p>
    <p>{{ customer !== null && customer.stamps >= 9 ? 'Next coffee is free!' : 'Collect stamps for free coffee' }}</p>
  `,
})
export class TillSmelly {
  @Input() card = '';
  @Input() amount = 0;
  private readonly directory = inject(CustomerDirectorySmelly);

  get customer(): CafeCustomer | null {
    return this.directory.find(this.card);
  }

  total(): number {
    const customer = this.customer;
    if (customer === null) {
      return this.amount;
    }
    return this.amount * (1 - customer.discountRate);
  }
}
