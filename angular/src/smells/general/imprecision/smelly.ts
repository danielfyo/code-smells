import { Injectable } from '@angular/core';

export interface Invoice {
  customerEmail: string;
  lines: number[]; // euros as floating-point numbers
}

@Injectable({ providedIn: 'root' })
export class SmellyBillingService {
  // SMELL: imprecision. Money as binary floats: 0.1 + 0.2 is 0.30000000000000004.
  total(invoice: Invoice): number {
    return invoice.lines.reduce((sum, amount) => sum + amount, 0);
  }

  // SMELL: exact equality on floats, so a correctly paid invoice looks unpaid.
  isFullyPaid(invoice: Invoice, paid: number): boolean {
    return this.total(invoice) === paid;
  }

  // SMELL: assumes the search returns exactly one result; [0] hides "none" and "several".
  findByEmail(invoices: readonly Invoice[], email: string): Invoice {
    return invoices.filter((invoice) => invoice.customerEmail === email)[0] as Invoice;
  }
}
