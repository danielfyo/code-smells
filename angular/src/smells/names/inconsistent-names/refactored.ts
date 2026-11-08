import { Injectable } from '@angular/core';

export interface Customer {
  id: number;
  email: string;
  name: string;
}

// REFACTOR: Rename to one name per concept. "Customer" everywhere; one verb per kind of
// operation: `list` for collections, `find...` for lookups that may miss, `count` for totals.
@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  private readonly customers: Customer[] = [
    { id: 1, email: 'ana@shop.test', name: 'Ana' },
    { id: 2, email: 'leo@shop.test', name: 'Leo' },
  ];

  listCustomers(): Customer[] {
    return [...this.customers];
  }

  findCustomerById(id: number): Customer | undefined {
    return this.customers.find((customer) => customer.id === id);
  }

  findCustomerByEmail(email: string): Customer | undefined {
    return this.customers.find((customer) => customer.email === email);
  }

  countCustomers(): number {
    return this.customers.length;
  }
}
