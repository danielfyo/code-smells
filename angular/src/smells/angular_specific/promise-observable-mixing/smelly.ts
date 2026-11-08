import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

interface Profile {
  id: number;
  name: string;
}
interface Order {
  id: number;
  total: number;
}

// SMELL: mixing promises and observables. The flow hops from Observable to Promise (toPromise,
// lastValueFrom, async/await) and back to subscribe(). Promises cannot be cancelled, so when the
// user leaves the page mid-flow the remaining requests are still sent and the results are still
// written into a destroyed component. Errors take two different paths as well.
@Component({
  selector: 'cs-promise-observable-mixing-smelly',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="summary">{{ summary() }}</p>`,
})
export class SmellyOrderHistoryComponent implements OnInit {
  private readonly http = inject(HttpClient);
  readonly summary = signal('Loading...');
  writesAfterLoad = 0;

  async ngOnInit(): Promise<void> {
    const profile = await this.http.get<Profile>('/api/me').toPromise();
    const orders = await lastValueFrom(this.http.get<Order[]>(`/api/users/${profile?.id}/orders`));
    this.http.get<{ currency: string }>('/api/settings').subscribe((settings) => {
      const total = orders.reduce((sum, order) => sum + order.total, 0);
      this.summary.set(`${profile?.name}: ${orders.length} orders, ${total} ${settings.currency}`);
      this.writesAfterLoad++;
    });
  }
}
