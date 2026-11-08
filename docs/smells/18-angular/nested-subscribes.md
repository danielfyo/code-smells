# Nested Subscribes

> **ID:** CS178 · **Category:** Angular-specific · **Sources:** RxJS docs: higher-order operators

## Definition

Calling `subscribe()` inside the callback of another `subscribe()` to chain dependent asynchronous work (read a route
parameter, then load the order, then load its customer) instead of composing the streams with a higher-order mapping
operator such as `switchMap`, `concatMap`, `mergeMap` or `exhaustMap`.

## Symptoms

- `a$.subscribe(a => { b$(a).subscribe(b => { ... }) })` pyramids.
- Inner subscriptions that are never unsubscribed, even when the outer one is.
- Results from an old request overwriting results from a newer one when the outer value changes quickly.
- Error handling duplicated (or missing) at every level.

## Common causes

- Thinking imperatively: "when this arrives, then fetch that".
- Not knowing the difference between the flattening operators.
- Treating observables as if they were promises with a callback.

## Why it is a problem

- **Races**: every outer emission starts a new inner request and nothing cancels the previous one.
- **Leaks**: the inner subscriptions are independent of the outer one; unsubscribing the outer does not stop them.
- **Callback hell**: the flow is hard to read, test and extend; errors in the inner stream do not reach the outer
  error handler.

## How it works under the hood

Most Angular observables (`HttpClient`, `ActivatedRoute.paramMap` derivations) are *cold*: each `subscribe()` starts a
new execution. A nested subscribe creates a new, unrelated execution for every outer value. Higher-order operators
instead subscribe to the inner observable **on your behalf** and manage its lifetime through the outer subscription:

- `switchMap` unsubscribes the previous inner observable when a new outer value arrives (ideal for "latest wins":
  route parameters, search boxes). For `HttpClient`, unsubscribing aborts the request.
- `concatMap` queues inner observables and runs them one after another (ordered writes).
- `mergeMap` runs them concurrently (independent work).
- `exhaustMap` ignores new outer values while one inner is active (double-click on "Save").

Because the whole chain is a single subscription, one `takeUntilDestroyed()` or `async` pipe tears everything down,
and errors propagate to a single `catchError`.

## Example (smelly)

```ts
export class OrderDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(OrderApi);
  order?: Order;
  customer?: Customer;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // SMELL: inner subscribes are never cancelled; responses can arrive out of order
      this.api.getOrder(params.get('id')!).subscribe(order => {
        this.order = order;
        this.api.getCustomer(order.customerId).subscribe(c => (this.customer = c));
      });
    });
  }
}
```

## Solution (refactored)

```ts
export class OrderDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(OrderApi);

  // REFACTOR: one composed stream; switchMap cancels stale requests
  private readonly view$ = this.route.paramMap.pipe(
    map(params => params.get('id') ?? ''),
    switchMap(id => this.api.getOrder(id)),
    switchMap(order =>
      this.api.getCustomer(order.customerId).pipe(map(customer => ({ order, customer }))),
    ),
  );

  readonly view = toSignal(this.view$); // REFACTOR: single subscription, cleaned up on destroy
}
```

## Recommended refactorings

- **Replace nested subscribe with a flattening operator** chosen by the concurrency semantics you need.
- Use `forkJoin` / `combineLatest` when the inner calls are independent of each other.
- **Move the subscription to the edge** (`toSignal()`, `async` pipe) so the chain has one owner.
- Handle errors once with `catchError` at the right level of the pipeline.

## When it may be acceptable

- Never as a composition technique. A subscribe inside a `tap()` or a service callback that fires a one-shot,
  fire-and-forget command can be tolerable if it is cancelled and documented, but an operator is still clearer.

## Related smells

- [Subscription Leak](./subscription-leak.md)
- [Mixing Promises and Observables](./promise-observable-mixing.md)
- [Callback Hell / Pyramid of Doom](../11-general/callback-hell.md)
- [Deep Nesting / Arrow Code](../07-functions/deep-nesting.md)
- [Fetch in Effect without Abort](../16-react-ts/fetch-race-condition.md) — the same race in React.

## Automatic detection

- eslint-plugin-rxjs / rxjs-x: `no-nested-subscribe`.
- eslint-plugin-rxjs / rxjs-x: `no-ignored-subscription` catches the discarded inner subscriptions.
- Tests with `HttpTestingController`: emit two route parameters and assert the first request was cancelled.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/nested-subscribes/`](../../../angular/src/smells/angular_specific/nested-subscribes/)

## References

- RxJS — *Operators* (higher-order observables): https://rxjs.dev/guide/operators
- RxJS — `switchMap`: https://rxjs.dev/api/operators/switchMap
- RxJS — `concatMap`: https://rxjs.dev/api/operators/concatMap
- Angular — *RxJS interop with Angular signals*: https://angular.dev/ecosystem/rxjs-interop
