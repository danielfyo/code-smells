import { Injectable, inject } from '@angular/core';
import { CALLBACK_CRM, Callback } from './crm';

@Injectable({ providedIn: 'root' })
export class SmellyOrderDigestService {
  private readonly crm = inject(CALLBACK_CRM);

  // SMELL: callback hell / pyramid of doom. Each step nests the next one, error handling is
  // repeated at every level and the happy path drifts to the right until it is unreadable.
  sendDigest(email: string, done: Callback<string>): void {
    this.crm.findCustomer(email, (customerError, customer) => {
      if (customerError || !customer) {
        done(customerError ?? new Error('Customer not found'));
      } else {
        this.crm.listOrders(customer.id, (ordersError, orders) => {
          if (ordersError || !orders) {
            done(ordersError ?? new Error('No orders'));
          } else {
            const total = orders.reduce((sum, order) => sum + order.total, 0);
            const body = `Hi ${customer.name}, you placed ${orders.length} orders for ${total} EUR`;
            this.crm.sendEmail(email, body, (mailError) => {
              if (mailError) {
                done(mailError);
              } else {
                done(null, body);
              }
            });
          }
        });
      }
    });
  }
}
