import { Component, Input } from '@angular/core';

// SMELL: Data Clumps. street, city, postalCode and country always travel together: as four
// inputs here, as four parameters in `isRemote` and `formatLine`, and in every parent template.
// Adding a "province" field means touching all of them.
@Component({
  selector: 'cs-data-clumps-smelly',
  template: `
    <h3>{{ recipient }}</h3>
    <p>{{ formatLine(street, city, postalCode, country) }}</p>
    <p>{{ isRemote(postalCode, country) ? 'Remote area surcharge' : 'Standard delivery' }}</p>
  `,
})
export class ShippingLabelSmelly {
  @Input() recipient = '';
  @Input() street = '';
  @Input() city = '';
  @Input() postalCode = '';
  @Input() country = '';

  formatLine(street: string, city: string, postalCode: string, country: string): string {
    return `${street}, ${postalCode} ${city} (${country})`;
  }

  isRemote(postalCode: string, country: string): boolean {
    return country === 'ES' && (postalCode.startsWith('35') || postalCode.startsWith('38'));
  }
}
