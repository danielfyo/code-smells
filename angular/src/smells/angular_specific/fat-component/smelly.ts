import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

interface OrderDto {
  id: number;
  customer: string;
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
}

// SMELL: fat component. One class fetches data (URL building and HTTP), holds business rules
// (VIP threshold, which orders count), manages loading/error/filter state and renders a table.
// None of it can be reused or tested without rendering the component and faking HTTP.
@Component({
  selector: 'cs-fat-component-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <p class="loading">Loading...</p>
    } @else if (error()) {
      <p class="error">{{ error() }}</p>
    } @else {
      <label><input type="checkbox" class="only-paid" [checked]="onlyPaid()" (change)="togglePaid()" /> Only paid</label>
      <table>
        @for (order of visible(); track order.id) {
          <tr [class.vip]="order.total >= 500"><td>{{ order.customer }}</td><td>{{ order.total }}</td></tr>
        }
      </table>
      <p class="revenue">Revenue: {{ revenue() }} EUR</p>
    }
  `,
})
export class SmellyOrdersDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly onlyPaid = signal(false);
  readonly orders = signal<OrderDto[]>([]);
  readonly visible = signal<OrderDto[]>([]);
  readonly revenue = signal(0);

  ngOnInit(): void {
    this.http.get<OrderDto[]>('/api/orders?year=' + new Date().getFullYear()).subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.recalculate();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load orders');
        this.loading.set(false);
      },
    });
  }

  togglePaid(): void {
    this.onlyPaid.update((value) => !value);
    this.recalculate();
  }

  private recalculate(): void {
    const active = this.orders().filter((o) => o.status !== 'cancelled');
    this.visible.set(this.onlyPaid() ? active.filter((o) => o.status === 'paid') : active);
    this.revenue.set(active.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.total, 0));
  }
}
