import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { ProductSearchApi } from './search.api';

// REFACTOR: flatten with a higher-order operator. switchMap unsubscribes from the previous search
// when a new term arrives, so a slow, stale response can never overwrite a newer one; toSignal
// owns the single outer subscription and closes it on destroy.
@Component({
  selector: 'cs-nested-subscribes-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (name of results(); track name) {
        <li>{{ name }}</li>
      }
    </ul>
  `,
})
export class ProductSearchComponent {
  private readonly api = inject(ProductSearchApi);
  private readonly terms = new Subject<string>();

  readonly results = toSignal(
    this.terms.pipe(
      debounceTime(0),
      switchMap((term) => this.api.search(term)),
    ),
    { initialValue: [] },
  );

  search(term: string): void {
    this.terms.next(term);
  }
}
