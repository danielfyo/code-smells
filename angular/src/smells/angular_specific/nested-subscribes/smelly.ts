import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { ProductSearchApi } from './search.api';

@Component({
  selector: 'cs-nested-subscribes-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (name of results(); track name) {
        <li>{{ name }}</li>
      }
    </ul>
  `,
})
export class SmellyProductSearchComponent implements OnInit {
  private readonly api = inject(ProductSearchApi);
  private readonly terms = new Subject<string>();
  readonly results = signal<string[]>([]);

  search(term: string): void {
    this.terms.next(term);
  }

  // SMELL: nested subscribes. Each term starts an inner subscription that nobody cancels. If the
  // response for "de" arrives after the one for "desk", the stale results overwrite the fresh
  // ones (a race). None of the subscriptions is ever closed either.
  ngOnInit(): void {
    this.terms.pipe(debounceTime(0)).subscribe((term) => {
      this.api.search(term).subscribe((names) => {
        this.results.set(names);
      });
    });
  }
}
