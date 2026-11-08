import { Injectable, inject } from '@angular/core';
import { CALLBACK_CRM, Callback, Customer, Order } from './crm';

// REFACTOR: wrap the callback API once (promisify) and write the flow with async/await. The steps
// read top to bottom and a single try/catch at the caller handles every failure.
function promisify<T>(call: (cb: Callback<T>) => void): Promise<T> {
  return new Promise<T>((resolve, reject) =>
    call((error, result) => (error ? reject(error) : resolve(result as T))),
  );
}

@Injectable({ providedIn: 'root' })
export class OrderDigestService {
  private readonly crm = inject(CALLBACK_CRM);

  async sendDigest(email: string): Promise<string> {
    const customer = await promisify<Customer>((cb) => this.crm.findCustomer(email, cb));
    const orders = await promisify<Order[]>((cb) => this.crm.listOrders(customer.id, cb));
    const total = orders.reduce((sum, order) => sum + order.total, 0);
    const body = `Hi ${customer.name}, you placed ${orders.length} orders for ${total} EUR`;
    await promisify<void>((cb) => this.crm.sendEmail(email, body, cb));
    return body;
  }
}
