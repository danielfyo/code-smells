import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// SMELL: $any() and any in templates. With strictTemplates Angular type-checks every binding, but
// an `any` input and `$any()` casts switch that off. The typos below ("adress", "totl", "lenght")
// compile without a warning and render blanks at runtime instead of failing the build.
@Component({
  selector: 'cs-any-in-templates-smelly',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="customer">{{ order().customer.name }} ({{ $any(order().customer).adress?.city }})</p>
    <p class="total">{{ order().totl | number: '1.2-2' }} EUR</p>
    <p class="items">{{ $any(order()).lines.lenght }} lines</p>
  `,
})
export class SmellyOrderCardComponent {
  readonly order = input.required<any>();
}
