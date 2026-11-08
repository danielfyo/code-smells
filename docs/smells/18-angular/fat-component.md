# Fat Component

> **ID:** CS180 · **Category:** Angular-specific · **Sources:** Angular style guide: single responsibility

## Definition

A single component that fetches data with `HttpClient`, holds business rules (pricing, validation, permissions),
manages local and shared state, talks to the router and renders a large template with several distinct sections.
It is the Angular version of the [Large Class / God Class](../01-bloaters/large-class.md).

## Symptoms

- Hundreds of lines in the class and a template with many unrelated `@if` / `@for` blocks.
- More than a handful of injected dependencies (`HttpClient`, `Router`, `MatDialog`, several services...).
- Business calculations (discounts, taxes, status transitions) written as component methods.
- Specs that need to mock half the application to test a single rule.
- Several developers editing the same component for unrelated features.

## Common causes

- Features that grew screen by screen without extracting anything.
- "Smart" and "presentational" responsibilities never separated.
- No data service or state service in the feature, so the page component becomes the default home for everything.

## Why it is a problem

- **Hard to test**: rules can only be exercised through `TestBed` and the DOM.
- **Divergent change**: UI tweaks, API changes and rule changes all touch the same file.
- **Poor reuse**: the logic cannot be reused by another screen or by a server-side job.
- **Performance**: one large view means any change re-checks a large template.

## How it works under the hood

A component is a unit of **view** plus its change detection: Angular checks the whole template of a component when
it is dirty. Splitting a fat component into presentational children with `OnPush` and signal inputs lets Angular skip
subtrees whose inputs did not change. Business logic lives better in plain TypeScript functions or `@Injectable`
services: they are resolved through dependency injection, can be provided at the root or at a route or component
level, and are testable without rendering anything. Signals in a service (`signal`, `computed`, exposed read-only)
give the page component a thin facade to bind to.

## Example (smelly)

```ts
@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.html', // 200 lines: filters, table, totals, edit dialog
})
export class OrdersPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  orders: Order[] = [];
  filter = '';

  ngOnInit(): void {
    this.http.get<Order[]>('/api/orders').subscribe(o => (this.orders = o)); // SMELL: data access
  }
  discount(o: Order): number {                                                // SMELL: business rule
    return o.total > 500 ? o.total * 0.1 : o.customer.vip ? o.total * 0.05 : 0;
  }
  visibleOrders(): Order[] { return this.orders.filter(o => o.ref.includes(this.filter)); }
  open(o: Order): void { this.router.navigate(['/orders', o.id]); }
  // ... export to CSV, permissions, dialog handling, totals ...
}
```

## Solution (refactored)

```ts
export function discountFor(o: Order): number {           // REFACTOR: pure domain function
  if (o.total > 500) return o.total * 0.1;
  return o.customer.vip ? o.total * 0.05 : 0;
}

@Injectable({ providedIn: 'root' })
export class OrdersStore {                                 // REFACTOR: state + data access
  private readonly api = inject(OrderApi);
  readonly filter = signal('');
  private readonly orders = toSignal(this.api.list(), { initialValue: [] });
  readonly visible = computed(() => this.orders().filter(o => o.ref.includes(this.filter())));
}

@Component({
  selector: 'app-orders-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrderFilter, OrderTable],                      // REFACTOR: presentational children
  template: `
    <app-order-filter [(value)]="store.filter" />
    <app-order-table [orders]="store.visible()" />
  `,
})
export class OrdersPage { protected readonly store = inject(OrdersStore); }
```

## Recommended refactorings

- **Extract Class** into a data service (HTTP) and a state service or store (signals).
- **Extract Function** for business rules into pure, framework-free modules.
- **Extract Component** for each visual section; keep them presentational (`input()` / `output()`).
- Keep the routed component as a thin container that wires services to children.

## When it may be acceptable

- Prototypes and very small screens with no rules and no reuse.
- A container component that only orchestrates children is fine even if it injects several services.

## Related smells

- [HttpClient in Components](./http-in-components.md)
- [Hard-coded Configuration in Services](./hardcoded-config.md)
- [Large Class / God Class](../01-bloaters/large-class.md)
- [Divergent Change](../03-change-preventers/divergent-change.md)
- [God Component / Large Component](../16-react-ts/god-component.md) — the React counterpart.

## Automatic detection

- ESLint core rules `max-lines`, `max-lines-per-function` and `complexity` applied to `*.component.ts` / `*.ts`.
- angular-eslint: `@angular-eslint/component-max-inline-declarations` limits inline templates and styles.
- Metrics tools (SonarQube cognitive complexity, number of constructor or `inject()` dependencies).

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/fat-component/`](../../../angular/src/smells/angular_specific/fat-component/)

## References

- Angular — *Style guide*: https://angular.dev/style-guide
- Angular — *Dependency injection*: https://angular.dev/guide/di
- Angular — *Signals*: https://angular.dev/guide/signals
- Angular — *Skipping component subtrees*: https://angular.dev/best-practices/skipping-subtrees
