import { Component, Input } from '@angular/core';

// SMELL: Incomplete Library Class. JavaScript's Date has no business-day arithmetic, so each
// component that needs it writes its own loop. The two copies already differ in style and
// will drift apart (holidays, time zones...).
@Component({
  selector: 'cs-incomplete-library-delivery-smelly',
  template: `<p>Delivery by {{ eta() }}</p>`,
})
export class DeliveryEtaSmelly {
  @Input() orderedOn = '';
  @Input() businessDays = 0;

  eta(): string {
    const date = new Date(this.orderedOn + 'T00:00:00Z');
    let added = 0;
    while (added < this.businessDays) {
      date.setUTCDate(date.getUTCDate() + 1);
      if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) added++;
    }
    return date.toISOString().slice(0, 10);
  }
}

@Component({
  selector: 'cs-incomplete-library-refund-smelly',
  template: `<p>Refund expected on {{ refundDate() }}</p>`,
})
export class RefundNoticeSmelly {
  @Input() requestedOn = '';

  refundDate(): string {
    const d = new Date(this.requestedOn + 'T00:00:00Z');
    for (let left = 5; left > 0; ) {
      d.setUTCDate(d.getUTCDate() + 1);
      const day = d.getUTCDay();
      if (day >= 1 && day <= 5) left--;
    }
    return d.toISOString().slice(0, 10);
  }
}
