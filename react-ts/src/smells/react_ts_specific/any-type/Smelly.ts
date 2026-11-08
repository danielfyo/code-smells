/* eslint-disable @typescript-eslint/no-explicit-any */
// SMELL: any abuse. The compiler stops helping: data of any shape is accepted,
// typos in property names compile and errors propagate silently.
export function formatOrder(order: any): string {
  // SMELL: "order.totl" (a typo) compiles fine and returns undefined.
  const items: any[] = order.items;
  const units = items.reduce((sum: any, item: any) => sum + item.qty, 0);
  return `Order ${order.id}: ${units} units, ${order.total} €`;
}

export function parseOrder(json: string): any {
  return JSON.parse(json); // SMELL: "any" infects everything that touches the result.
}

export function totalWithTax(order: any): any {
  return order.total * 1.21; // SMELL: if total arrives as the string "10", coercion yields 12.1... or NaN.
}
