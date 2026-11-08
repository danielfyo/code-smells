import { InjectionToken } from '@angular/core';

export interface Customer {
  id: number;
  name: string;
}
export interface Order {
  id: number;
  total: number;
}
export type Callback<T> = (error: Error | null, result?: T) => void;

/** A legacy SDK that only offers Node-style callbacks. */
export interface CallbackCrm {
  findCustomer(email: string, cb: Callback<Customer>): void;
  listOrders(customerId: number, cb: Callback<Order[]>): void;
  sendEmail(to: string, body: string, cb: Callback<void>): void;
}
export const CALLBACK_CRM = new InjectionToken<CallbackCrm>('CALLBACK_CRM');
