import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TimeEntry } from './model';

const RUSH_SURCHARGE = 1.25;
const VOLUME_DISCOUNT_THRESHOLD_HOURS = 40;
const VOLUME_DISCOUNT_RATE = 0.05;
const WITHHOLDING_RATE = 0.15;

// REFACTOR: Extract Function. Every billing rule is a small, named, pure function.
export function billableEntries(entries: readonly TimeEntry[]): TimeEntry[] {
  return entries.filter((entry) => entry.billable);
}

export function totalHours(entries: readonly TimeEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.hours, 0);
}

export function grossFee(hours: number, hourlyRate: number, rush: boolean): number {
  const fee = hours * hourlyRate;
  return rush ? fee * RUSH_SURCHARGE : fee;
}

export function volumeDiscount(hours: number, fee: number): number {
  return hours > VOLUME_DISCOUNT_THRESHOLD_HOURS ? fee * VOLUME_DISCOUNT_RATE : 0;
}

export function withholdingFor(net: number): number {
  return net * WITHHOLDING_RATE;
}

// REFACTOR: Compose Method. The component only wires computed signals together and the
// template formats them, so each step reads like a sentence.
@Component({
  selector: 'cs-long-method-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      @for (entry of billable(); track $index) {
        <p>{{ entry.task }}: {{ entry.hours.toFixed(1) }} h</p>
      }
      <p>Fee: {{ fee().toFixed(2) }}</p>
      @if (discount() > 0) {
        <p>Volume discount: -{{ discount().toFixed(2) }}</p>
      }
      <p>Withholding: -{{ withholding().toFixed(2) }}</p>
      <p>To pay: {{ toPay().toFixed(2) }}</p>
    </section>
  `,
})
export class FreelanceInvoiceRefactored {
  readonly entries = input<readonly TimeEntry[]>([]);
  readonly hourlyRate = input(0);
  readonly rush = input(false);

  protected readonly billable = computed(() => billableEntries(this.entries()));
  private readonly hours = computed(() => totalHours(this.billable()));
  protected readonly fee = computed(() => grossFee(this.hours(), this.hourlyRate(), this.rush()));
  protected readonly discount = computed(() => volumeDiscount(this.hours(), this.fee()));
  private readonly net = computed(() => this.fee() - this.discount());
  protected readonly withholding = computed(() => withholdingFor(this.net()));
  protected readonly toPay = computed(() => this.net() - this.withholding());
}
