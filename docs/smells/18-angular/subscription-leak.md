# Subscription Leak

> **ID:** CS177 · **Category:** Angular-specific · **Sources:** angular.dev: takeUntilDestroyed; RxJS docs

## Definition

A component or directive calls `subscribe()` on a long-lived observable (an `interval`, a store, a `Subject` in a root
service, router events, a WebSocket) and never unsubscribes. The subscription keeps running after the component has
been destroyed, executing callbacks against a view that no longer exists.

## Symptoms

- `.subscribe(...)` in `ngOnInit` or the constructor whose returned `Subscription` is discarded.
- No `takeUntilDestroyed()`, `DestroyRef`, `async` pipe or `toSignal()` anywhere in the component.
- Logs, HTTP calls or analytics events that keep firing after navigating away from a page.
- Callbacks that fire twice, three times... after visiting the same route several times.
- Memory snapshots that show detached component instances retained by RxJS subscribers.

## Common causes

- Assuming every observable completes on its own, as `HttpClient` requests do.
- Copying the "subscribe and assign to a field" pattern from tutorials.
- Manual `Subscription` bookkeeping in `ngOnDestroy` that someone forgot to extend when adding a new stream.

## Why it is a problem

- **Memory leaks**: the subscriber closure captures `this`, so the whole component (and its view data) stays alive.
- **Duplicated work**: each visit adds one more subscriber; the work grows with navigation.
- **Wrong behaviour**: stale callbacks write into services, trigger requests or show notifications for screens the
  user already left.

## How it works under the hood

An observable is a function that, on `subscribe()`, wires an observer to a producer and returns a `Subscription`.
A *hot* source owned by a root service (a `Subject`, a store, `interval` shared via `share()`) keeps a list of its
subscribers for as long as the service lives, which in a root injector means the whole application lifetime. Angular
destroys the component's view, but nothing removes the observer from that list, so the closure and everything it
references survive. `HttpClient` observables complete after one emission, which is why leaks often go unnoticed until
a non-completing stream appears.

`DestroyRef` is the lifetime handle of the current injector (component, directive, service or environment).
`takeUntilDestroyed()` registers a callback with `DestroyRef.onDestroy()` and completes the stream when it fires; it
must run in an injection context (field initializer or constructor) or receive a `DestroyRef` explicitly. The `async`
pipe and `toSignal()` do the same bookkeeping automatically.

## Example (smelly)

```ts
@Component({
  selector: 'app-order-ticker',
  template: `<p>Open orders: {{ count }}</p>`,
})
export class OrderTicker implements OnInit {
  private readonly orders = inject(OrderStream);
  count = 0;

  ngOnInit(): void {
    // SMELL: hot stream from a root service, never unsubscribed
    this.orders.openCount$.subscribe(n => {
      this.count = n;
      console.log('ticker updated', n); // keeps logging after destroy
    });
  }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-order-ticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Open orders: {{ count() }}</p>`,
})
export class OrderTicker {
  private readonly orders = inject(OrderStream);

  // REFACTOR: toSignal subscribes in the injection context and unsubscribes on destroy
  readonly count = toSignal(this.orders.openCount$, { initialValue: 0 });

  constructor() {
    // REFACTOR: side effects that must stay imperative end with takeUntilDestroyed()
    this.orders.openCount$
      .pipe(takeUntilDestroyed())
      .subscribe(n => console.log('ticker updated', n));
  }
}
```

## Recommended refactorings

- **Prefer declarative consumption**: `toSignal()` or the `async` pipe in the template.
- **Add `takeUntilDestroyed()`** as the last operator of imperative subscriptions; pass `inject(DestroyRef)` when
  subscribing outside an injection context.
- **Replace hand-written `Subscription` arrays** and `ngOnDestroy` boilerplate with `DestroyRef`.
- Use `take(1)` / `first()` only when exactly one value is really wanted.

## When it may be acceptable

- Observables that are guaranteed to complete (a single `HttpClient` call), although adding `takeUntilDestroyed()`
  still cancels the request if the user leaves early.
- Subscriptions inside root services that live as long as the application by design.

## Related smells

- [Nested Subscribes](./nested-subscribes.md)
- [Mixing Promises and Observables](./promise-observable-mixing.md)
- [Missing Effect Cleanup](../16-react-ts/missing-effect-cleanup.md) — the same problem in React.
- [Goroutine Leak](../17-go/goroutine-leak.md)
- [Missing using / IDisposable Leak](../15-csharp/missing-dispose.md)

## Automatic detection

- eslint-plugin-rxjs / rxjs-x: `no-ignored-subscription` (flags discarded `Subscription` objects) and
  `no-unsafe-takeuntil` (operators placed after `takeUntil`).
- eslint-plugin-rxjs-angular: `prefer-takeuntil` and `prefer-async-pipe`.
- Tests: destroy the fixture, emit on the source and assert the callback no longer runs.
- Browser memory snapshots: search for detached component instances.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/subscription-leak/`](../../../angular/src/smells/angular_specific/subscription-leak/)

## References

- Angular — *Unsubscribing with takeUntilDestroyed*: https://angular.dev/ecosystem/rxjs-interop/take-until
- Angular — *RxJS interop with Angular signals*: https://angular.dev/ecosystem/rxjs-interop
- Angular — `DestroyRef`: https://angular.dev/api/core/DestroyRef
- RxJS — *Subscription*: https://rxjs.dev/guide/subscription
- angular-eslint: https://github.com/angular-eslint/angular-eslint
