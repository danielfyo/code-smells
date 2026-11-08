import { Injectable } from '@angular/core';

// REFACTOR: Be precise. Amounts are integer cents (exact arithmetic), and lookups state their
// cardinality: "zero or one" returns undefined for none and throws on an ambiguous match.
export type Cents = number;

export interface Invoice {
  customerEmail: string;
  lines: Cents[];
}

export const toCents = (euros: number): Cents => Math.round(euros * 100);

@Injectable({ providedIn: 'root' })
export class BillingService {
  total(invoice: Invoice): Cents {
    return invoice.lines.reduce((sum, amount) => sum + amount, 0);
  }

  isFullyPaid(invoice: Invoice, paid: Cents): boolean {
    return this.total(invoice) === paid;
  }

  findByEmail(invoices: readonly Invoice[], email: string): Invoice | undefined {
    const matches = invoices.filter((invoice) => invoice.customerEmail === email);
    if (matches.length > 1) throw new Error(`Several invoices for ${email}`);
    return matches[0];
  }
}
