import type { Customer, Order } from './model';
import { customersToCsv, customersToJson, ordersToCsv, ordersToJson } from './smelly';
import { CUSTOMER_COLUMNS, ORDER_COLUMNS, exportRows } from './refactored';

const customers: Customer[] = [
  { id: 1, name: 'Ada', city: 'Bilbao' },
  { id: 2, name: 'Teo', city: 'Vigo' },
];
const orders: Order[] = [{ id: 10, customerId: 1, totalCents: 4599 }];

describe('Combinatorial Explosion', () => {
  it('every entity/format combination matches the hand-written functions', () => {
    expect(exportRows(customers, CUSTOMER_COLUMNS, 'csv')).toBe(customersToCsv(customers));
    expect(exportRows(customers, CUSTOMER_COLUMNS, 'json')).toBe(customersToJson(customers));
    expect(exportRows(orders, ORDER_COLUMNS, 'csv')).toBe(ordersToCsv(orders));
    expect(exportRows(orders, ORDER_COLUMNS, 'json')).toBe(ordersToJson(orders));
  });

  it('a new entity needs only its columns', () => {
    const products = [{ sku: 'K-1', stock: 3 }];
    const csv = exportRows(products, [
      { header: 'sku', value: (p) => p.sku },
      { header: 'stock', value: (p) => p.stock },
    ], 'csv');
    expect(csv).toBe('sku,stock\nK-1,3');
  });
});
