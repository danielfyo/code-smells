import { Injectable } from '@angular/core';

// REFACTOR: Rename Variable / Rename Function / Rename Field. Every name reveals intent, so the
// code reads like the business rule: "summarize the non-cancelled orders of a customer".
export type OrderStatus = 'PAID' | 'PENDING' | 'X';

export interface Order {
  amount: number;
  status: OrderStatus;
  customerId: string;
}

export interface CustomerOrderSummary {
  orderCount: number;
  totalSpent: number;
  largestOrder: number;
}

const CANCELLED: OrderStatus = 'X';

@Injectable({ providedIn: 'root' })
export class OrderStatsService {
  summarizeCustomerOrders(orders: readonly Order[], customerId: string): CustomerOrderSummary {
    const activeOrders = orders.filter((order) => order.customerId === customerId && order.status !== CANCELLED);
    const amounts = activeOrders.map((order) => order.amount);
    return {
      orderCount: activeOrders.length,
      totalSpent: amounts.reduce((sum, amount) => sum + amount, 0),
      largestOrder: Math.max(0, ...amounts),
    };
  }
}
