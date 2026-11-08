// REFACTOR: names without encoded type or scope. The type system and the "private"
// modifier already convey that information.
export interface Customer {
  name: string;
  age: number;
  active: boolean;
}

export class CustomerDirectory {
  private customers: Customer[] = [];

  addCustomer(customer: Customer): void {
    this.customers.push(customer);
  }

  getActiveNames(): string[] {
    return this.customers.filter((customer) => customer.active).map((customer) => customer.name);
  }

  getTotal(): string {
    return `${this.customers.length} customers`;
  }
}
