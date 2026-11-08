import { Injectable } from '@angular/core';

/*
 * SMELL: inappropriate information. Authorship, dates, a change log and ticket numbers belong
 * in version control and the issue tracker, not in the source file. Nobody keeps them up to date.
 *
 * File:    invoice-totals.service.ts
 * Author:  J. Smith (jsmith@company.local)
 * Created: 2019-03-12
 *
 * CHANGE LOG
 * 2019-04-01  JS   Initial version (TICKET-1203)
 * 2020-11-17  MK   Added VAT, see TICKET-2210 and the email thread with finance
 * 2021-06-02  JS   Fixed rounding (hotfix, deployed on a Friday, sorry)
 * 2023-01-09  AL   Reviewed by the architecture committee, approved v3
 */
export interface InvoiceLine {
  quantity: number;
  unitPrice: number;
}

@Injectable({ providedIn: 'root' })
export class SmellyInvoiceTotalsService {
  // SMELL: "Modified by MK on 2020-11-17 (TICKET-2210)": history, not explanation.
  readonly vatRate = 0.21;

  // SMELL: "Reviewed in sprint 42 with the PO, OK" tells the reader nothing about the code.
  subtotal(lines: readonly InvoiceLine[]): number {
    return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }

  // SMELL: "JS 2021-06-02: rounding fix, ask me before touching" (who is JS? are they still here?)
  total(lines: readonly InvoiceLine[]): number {
    const gross = this.subtotal(lines) * (1 + this.vatRate);
    return Math.round(gross * 100) / 100;
  }
}
