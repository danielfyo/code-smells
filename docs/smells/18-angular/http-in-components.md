# HttpClient in Components

> **ID:** CS189 · **Category:** Angular-specific · **Sources:** Angular style guide: data services

## Definition

Components that inject `HttpClient`, build URLs and query strings, map raw responses and handle HTTP errors
themselves, instead of delegating to a data service with intention-revealing, typed methods (`orders.list()`,
`orders.cancel(id)`).

## Symptoms

- `inject(HttpClient)` in `@Component` classes.
- URL strings (`'/api/orders?status=' + status`) and `HttpParams` built in components.
- The same endpoint called with slightly different code in several components.
- Response mapping (`map(r => r.data.items)`) and error handling duplicated across screens.
- Component specs that need `HttpTestingController` to test simple rendering.

## Common causes

- "It is only one call" in an early version of the screen.
- No agreed data-access layer in the project.
- Tutorials that call `HttpClient` from components for brevity.

## Why it is a problem

- **Duplication**: endpoints, DTO mapping and error handling are copied around.
- **Shotgun surgery**: an API change requires editing every component that calls it.
- **Testing**: rendering tests become HTTP tests; logic cannot be reused without the component.
- **Mixed responsibilities**: presentation and transport concerns live together.

## How it works under the hood

`HttpClient` methods return **cold** observables: nothing is sent until someone subscribes, and every subscription
sends a new request. Requests go through the interceptor chain configured with
`provideHttpClient(withInterceptors(...))`. A data service is a plain `@Injectable({ providedIn: 'root' })` resolved
from the root injector: it centralizes URLs (ideally from injected configuration), DTO-to-model mapping and retries,
and exposes typed observables or signals. Components receive it through `inject()` and can be tested by providing a
fake through DI, while the service itself is tested with `provideHttpClientTesting()` and `HttpTestingController`.

## Example (smelly)

```ts
@Component({
  selector: 'app-open-orders',
  template: `@for (o of orders(); track o.id) { <li>{{ o.ref }}</li> }`,
})
export class OpenOrders {
  private readonly http = inject(HttpClient);              // SMELL: transport in the view
  readonly orders = signal<Order[]>([]);

  constructor() {
    const params = new HttpParams().set('status', 'open').set('limit', 50);
    this.http
      .get<{ data: { items: OrderDto[] } }>('https://api.shop.test/v1/orders', { params })
      .pipe(map(r => r.data.items.map(d => ({ id: d.order_id, ref: d.reference }))))
      .subscribe(o => this.orders.set(o));                 // SMELL: mapping and URL here too
  }
}
```

## Solution (refactored)

```ts
@Injectable({ providedIn: 'root' })
export class OrderApi {                                     // REFACTOR: data service
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listOpen(limit = 50): Observable<Order[]> {
    const params = new HttpParams().set('status', 'open').set('limit', limit);
    return this.http
      .get<{ data: { items: OrderDto[] } }>(`${this.baseUrl}/orders`, { params })
      .pipe(map(r => r.data.items.map(toOrder)));
  }
}

@Component({
  selector: 'app-open-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (o of orders(); track o.id) { <li>{{ o.ref }}</li> }`,
})
export class OpenOrders {
  readonly orders = toSignal(inject(OrderApi).listOpen(), { initialValue: [] }); // REFACTOR
}
```

## Recommended refactorings

- **Extract Class**: move HTTP calls into a data service per resource.
- **Introduce a mapping function** (`toOrder`) so DTOs never reach templates.
- **Inject the base URL** via an `InjectionToken` instead of hard-coding it.
- Put cross-cutting concerns (auth headers, retries, logging) in interceptors.

## When it may be acceptable

- Prototypes and throw-away demos.
- A component-scoped resource helper used in exactly one place, still with the URL coming from configuration.

## Related smells

- [Fat Component](./fat-component.md)
- [Hard-coded Configuration in Services](./hardcoded-config.md)
- [Duplicate async Subscriptions](./duplicate-async-subscriptions.md)
- [Business Logic in Components](../16-react-ts/business-logic-in-components.md)
- [Misplaced Responsibility](../11-general/misplaced-responsibility.md)

## Automatic detection

- ESLint `no-restricted-imports` / `no-restricted-syntax` scoped to component files to forbid `HttpClient`.
- Architecture linters (e.g. dependency rules with eslint-plugin-boundaries or Nx module boundaries).
- Code review: `inject(HttpClient)` inside `@Component` classes.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/http-in-components/`](../../../angular/src/smells/angular_specific/http-in-components/)

## References

- Angular — *HTTP client*: https://angular.dev/guide/http
- Angular — *Style guide*: https://angular.dev/style-guide
- Angular — *Dependency injection*: https://angular.dev/guide/di
- Angular — *RxJS interop with Angular signals*: https://angular.dev/ecosystem/rxjs-interop
