import type { Customer, Order } from './model';

// REFACTOR: Separate the two axes of variation. "What to export" is described by columns and
// "how to write it" by a serializer; any entity can be combined with any format.
export interface Column<T> {
  header: string;
  value: (row: T) => string | number;
}

type Table = { headers: string[]; rows: (string | number)[][] };

export type Format = 'csv' | 'json';

const SERIALIZERS: Record<Format, (table: Table) => string> = {
  csv: ({ headers, rows }) => [headers.join(','), ...rows.map((r) => r.join(','))].join('\n'),
  json: ({ headers, rows }) =>
    JSON.stringify(rows.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])))),
};

export function exportRows<T>(rows: readonly T[], columns: readonly Column<T>[], format: Format): string {
  const table: Table = {
    headers: columns.map((c) => c.header),
    rows: rows.map((row) => columns.map((c) => c.value(row))),
  };
  return SERIALIZERS[format](table);
}

export const CUSTOMER_COLUMNS: readonly Column<Customer>[] = [
  { header: 'id', value: (c) => c.id },
  { header: 'name', value: (c) => c.name },
  { header: 'city', value: (c) => c.city },
];

export const ORDER_COLUMNS: readonly Column<Order>[] = [
  { header: 'id', value: (o) => o.id },
  { header: 'customer', value: (o) => o.customerId },
  { header: 'total', value: (o) => (o.totalCents / 100).toFixed(2) },
];
