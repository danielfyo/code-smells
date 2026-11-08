import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

// REFACTOR: Introduce Parameter Object / Extract Class. The clump becomes an Address type and
// the behavior that only needs those fields moves next to it.
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function formatAddress({ street, city, postalCode, country }: Address): string {
  return `${street}, ${postalCode} ${city} (${country})`;
}

const REMOTE_PREFIXES_ES = ['35', '38'];

export function isRemoteArea({ postalCode, country }: Address): boolean {
  return country === 'ES' && REMOTE_PREFIXES_ES.some((prefix) => postalCode.startsWith(prefix));
}

@Component({
  selector: 'cs-data-clumps-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3>{{ recipient() }}</h3>
    <p>{{ line() }}</p>
    <p>{{ remote() ? 'Remote area surcharge' : 'Standard delivery' }}</p>
  `,
})
export class ShippingLabelRefactored {
  readonly recipient = input('');
  // REFACTOR: Preserve Whole Object. One input instead of four.
  readonly address = input.required<Address>();

  protected readonly line = computed(() => formatAddress(this.address()));
  protected readonly remote = computed(() => isRemoteArea(this.address()));
}
