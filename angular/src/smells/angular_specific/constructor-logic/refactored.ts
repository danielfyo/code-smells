import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CustomerApi } from './customer.api';

// REFACTOR: the constructor (field initializers) only declares dependencies and reactive
// relationships. Loading is derived from the input: it runs once the input has a value and again
// whenever it changes, with switchMap cancelling the previous request.
@Component({
  selector: 'cs-constructor-logic-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2 class="name">{{ customer()?.name }}</h2>`,
})
export class CustomerCardComponent {
  private readonly api = inject(CustomerApi);
  readonly customerId = input.required<string>();

  readonly customer = toSignal(toObservable(this.customerId).pipe(switchMap((id) => this.api.load(id))));
}
