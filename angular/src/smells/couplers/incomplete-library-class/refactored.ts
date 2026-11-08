import { ChangeDetectionStrategy, Component, Pipe, type PipeTransform, input } from '@angular/core';

// REFACTOR: Introduce Local Extension. The missing library feature lives in one module with a
// clear API (here a function plus a pipe), so every screen reuses the same rules.
export function isBusinessDay(date: Date): boolean {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6;
}

export function addBusinessDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  let remaining = days;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (isBusinessDay(date)) remaining--;
  }
  return date.toISOString().slice(0, 10);
}

@Pipe({ name: 'addBusinessDays' })
export class AddBusinessDaysPipe implements PipeTransform {
  transform(isoDate: string, days: number): string {
    return addBusinessDays(isoDate, days);
  }
}

const REFUND_BUSINESS_DAYS = 5;

@Component({
  selector: 'cs-incomplete-library-delivery-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddBusinessDaysPipe],
  template: `<p>Delivery by {{ orderedOn() | addBusinessDays: businessDays() }}</p>`,
})
export class DeliveryEtaRefactored {
  readonly orderedOn = input('');
  readonly businessDays = input(0);
}

@Component({
  selector: 'cs-incomplete-library-refund-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AddBusinessDaysPipe],
  template: `<p>Refund expected on {{ requestedOn() | addBusinessDays: refundDays }}</p>`,
})
export class RefundNoticeRefactored {
  readonly requestedOn = input('');
  protected readonly refundDays = REFUND_BUSINESS_DAYS;
}
