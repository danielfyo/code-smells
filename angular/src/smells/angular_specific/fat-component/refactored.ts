import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injectable, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of } from 'rxjs';

export interface Order {
  id: number;
  customer: string;
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
}

// REFACTOR: Extract Service / Extract Function / Extract Component. Each responsibility has a home:
// 1) data access in a service, 2) business rules as pure functions, 3) presentation in a dumb
// component, 4) a thin container that wires state with signals.
@Injectable({ providedIn: 'root' })
export class OrdersApi {
  private readonly http = inject(HttpClient);
  ordersOfYear(year: number): Observable<Order[]> {
    return this.http.get<Order[]>('/api/orders', { params: { year } });
  }
}

export const VIP_THRESHOLD = 500;
export const activeOrders = (orders: readonly Order[]) => orders.filter((o) => o.status !== 'cancelled');
export const paidOrders = (orders: readonly Order[]) => orders.filter((o) => o.status === 'paid');
export const revenueOf = (orders: readonly Order[]) => paidOrders(orders).reduce((sum, o) => sum + o.total, 0);

@Component({
  selector: 'cs-fat-component-order-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table>
      @for (order of orders(); track order.id) {
        <tr [class.vip]="order.total >= vipThreshold"><td>{{ order.customer }}</td><td>{{ order.total }}</td></tr>
      }
    </table>
  `,
})
export class OrderTableComponent {
  readonly orders = input.required<readonly Order[]>();
  protected readonly vipThreshold = VIP_THRESHOLD;
}

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; orders: Order[] };

@Component({
  selector: 'cs-fat-component-refactored',
  imports: [OrderTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (state().status) {
      @case ('loading') { <p class="loading">Loading...</p> }
      @case ('error') { <p class="error">Could not load orders</p> }
      @default {
        <label><input type="checkbox" class="only-paid" [checked]="onlyPaid()" (change)="togglePaid()" /> Only paid</label>
        <cs-fat-component-order-table [orders]="visible()" />
        <p class="revenue">Revenue: {{ revenue() }} EUR</p>
      }
    }
  `,
})
export class OrdersDashboardComponent {
  private readonly api = inject(OrdersApi);
  readonly onlyPaid = signal(false);

  readonly state = toSignal(
    this.api.ordersOfYear(new Date().getFullYear()).pipe(
      map((orders): LoadState => ({ status: 'ready', orders })),
      catchError(() => of<LoadState>({ status: 'error' })),
    ),
    { initialValue: { status: 'loading' } as LoadState },
  );

  private readonly active = computed(() => {
    const state = this.state();
    return state.status === 'ready' ? activeOrders(state.orders) : [];
  });
  readonly visible = computed(() => (this.onlyPaid() ? paidOrders(this.active()) : this.active()));
  readonly revenue = computed(() => revenueOf(this.active()));

  togglePaid(): void {
    this.onlyPaid.update((value) => !value);
  }
}
