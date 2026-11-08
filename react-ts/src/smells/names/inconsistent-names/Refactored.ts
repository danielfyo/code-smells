// REFACTOR: one concept, one word. Always "customer" and always "find/list" with the
// same meaning: find returns one (or undefined), list returns collections.
export interface Customer {
  id: number;
  name: string;
}

const customers: Customer[] = [
  { id: 1, name: "Anna" },
  { id: 2, name: "Luke" },
];

export function findCustomer(id: number): Customer | undefined {
  return customers.find((customer) => customer.id === id);
}

export function listCustomers(): Customer[] {
  return [...customers];
}

export function findCustomerName(id: number): string {
  return findCustomer(id)?.name ?? "unknown";
}
