# Duplicate async Subscriptions

> **ID:** CS193 · **Category:** Angular-specific · **Sources:** RxJS docs: shareReplay

## Definition

Binding the same **cold** observable with several `async` pipes in a template (`(order$ | async)?.ref`,
`(order$ | async)?.total`...). Each pipe subscribes independently, so each one triggers its own execution — typically
one HTTP request per usage.

## Symptoms

- `order$ | async` repeated several times in one template, or across parent and child.
- The network tab showing the same request two, three or more times when the page loads.
- Values in different parts of the view briefly disagreeing because responses arrive at different times.
- Extra `@if (x$ | async)` wrappers added only to avoid null checks.

## Common causes

- Not knowing that `HttpClient` observables are cold.
- Treating an observable like a variable that holds a value.
- Templates growing over time, each new section adding its own `| async`.

## Why it is a problem

- **Wasted requests and server load**, multiplied by every usage and every visit.
- **Inconsistent UI**: separate executions can return different data.
- **Side effects repeated**: logging, analytics or `tap()` code runs once per subscriber.

## How it works under the hood

A cold observable runs its producer function **per subscriber**: `HttpClient.get()` sends a new request for every
`subscribe()`. The `async` pipe subscribes when its binding is first evaluated and unsubscribes when the view is
destroyed, one subscription per pipe instance. Multicasting operators convert a cold source into a shared one:
`share()` uses a single subject for all current subscribers; `shareReplay({ bufferSize: 1, refCount: true })` also
replays the last value to late subscribers and unsubscribes from the source when the last subscriber leaves (without
`refCount: true`, the source subscription stays alive forever). Alternatively, subscribe **once** in the template
with `@let order = order$ | async;` or convert once with `toSignal()` and read the signal everywhere.

## Example (smelly)

```ts
@Component({
  selector: 'app-order-header',
  imports: [AsyncPipe, CurrencyPipe],
  template: `
    <h2>Order {{ (order$ | async)?.ref }}</h2>                 <!-- request #1 -->
    <p>{{ (order$ | async)?.customer }}</p>                     <!-- request #2 -->
    <p>{{ (order$ | async)?.total | currency: 'EUR' }}</p>      <!-- request #3 -->
  `,
})
export class OrderHeader {
  readonly order$ = inject(OrderApi).get('ORD-42'); // SMELL: cold; every async pipe re-executes it
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-order-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    @if (order(); as o) {
      <h2>Order {{ o.ref }}</h2>
      <p>{{ o.customer }}</p>
      <p>{{ o.total | currency: 'EUR' }}</p>
    }
  `,
})
export class OrderHeader {
  readonly order = toSignal(inject(OrderApi).get('ORD-42')); // REFACTOR: one subscription, read many times
}
```

## Recommended refactorings

- **Subscribe once**: `toSignal()`, `@let x = obs$ | async;`, or a single `@if (obs$ | async; as x)` block.
- **Share the stream** with `shareReplay({ bufferSize: 1, refCount: true })` when several components consume it.
- Cache at the service level when the data is genuinely shared across screens.

## When it may be acceptable

- Hot observables (subjects, signals converted with `toObservable`, already-shared streams) where extra subscribers
  do not cause extra work.
- Streams where each subscriber is *meant* to get its own execution (e.g. independent timers).

## Related smells

- [HttpClient in Components](./http-in-components.md)
- [Subscription Leak](./subscription-leak.md)
- [Function Calls in Templates](./function-calls-in-template.md)
- [Duplicate Code](../04-dispensables/duplicate-code.md)
- [Multiple Enumeration of IEnumerable](../15-csharp/multiple-enumeration.md) — the same "re-executing a lazy source" problem in C#.

## Automatic detection

- No dedicated lint rule for repeated `async` pipes; search templates for the same `x$ | async` more than once.
- eslint-plugin-rxjs / rxjs-x: `no-sharereplay` can require the configuration-object form so `refCount` is explicit.
- Tests with `HttpTestingController.expectOne()` fail when the same URL is requested more than once.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/duplicate-async-subscriptions/`](../../../angular/src/smells/angular_specific/duplicate-async-subscriptions/)

## References

- RxJS — `shareReplay`: https://rxjs.dev/api/operators/shareReplay
- RxJS — *Observable* (cold execution per subscriber): https://rxjs.dev/guide/observable
- Angular — *RxJS interop with Angular signals*: https://angular.dev/ecosystem/rxjs-interop
- Angular — *HTTP client*: https://angular.dev/guide/http
