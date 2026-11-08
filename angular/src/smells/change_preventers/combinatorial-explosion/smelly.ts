import type { Customer, Order } from './model';

// SMELL: Combinatorial Explosion. One function per (entity x format) pair. Two entities and two
// formats already need four near-identical functions; adding XML or Products multiplies them.
export function customersToCsv(customers: readonly Customer[]): string {
  return ['id,name,city', ...customers.map((c) => `${c.id},${c.name},${c.city}`)].join('\n');
}

export function customersToJson(customers: readonly Customer[]): string {
  return JSON.stringify(customers.map((c) => ({ id: c.id, name: c.name, city: c.city })));
}

export function ordersToCsv(orders: readonly Order[]): string {
  return ['id,customer,total', ...orders.map((o) => `${o.id},${o.customerId},${(o.totalCents / 100).toFixed(2)}`)].join(
    '\n',
  );
}

export function ordersToJson(orders: readonly Order[]): string {
  return JSON.stringify(
    orders.map((o) => ({ id: o.id, customer: o.customerId, total: (o.totalCents / 100).toFixed(2) })),
  );
}
