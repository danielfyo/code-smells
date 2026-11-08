import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, combineLatest } from 'rxjs';

interface Profile {
  id: number;
  name: string;
}
interface Order {
  id: number;
  total: number;
}

// REFACTOR: stay in one paradigm. A single Observable pipeline (switchMap to chain dependent
// requests, combineLatest to join independent ones) owned by toSignal. Destroying the component
// unsubscribes, which cancels the in-flight HTTP request and skips the rest of the chain.
@Component({
  selector: 'cs-promise-observable-mixing-refactored',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="summary">{{ summary() }}</p>`,
})
export class OrderHistoryComponent {
  private readonly http = inject(HttpClient);

  readonly summary = toSignal(
    this.http.get<Profile>('/api/me').pipe(
      switchMap((profile) =>
        combineLatest([this.http.get<Order[]>(`/api/users/${profile.id}/orders`), this.http.get<{ currency: string }>('/api/settings')]).pipe(
          map(([orders, settings]) => {
            const total = orders.reduce((sum, order) => sum + order.total, 0);
            return `${profile.name}: ${orders.length} orders, ${total} ${settings.currency}`;
          }),
        ),
      ),
    ),
    { initialValue: 'Loading...' },
  );
}
