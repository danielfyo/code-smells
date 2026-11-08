# Mixing Promises and Observables

> **ID:** CS190 · **Category:** Angular-specific · **Sources:** RxJS docs: firstValueFrom

## Definition

Converting observables to promises with `toPromise()` (deprecated) or `firstValueFrom()`, awaiting them, then
subscribing again or wrapping the result back into an observable, all within the same flow. The mix loses what
observables provide — cancellation, composition, lazy execution — and makes the control flow hard to follow.

## Symptoms

- `await this.http.get(...).toPromise()` in components or services.
- `async` callbacks passed to `subscribe()` (`subscribe(async x => { await ... })`).
- `from(promise)` and `firstValueFrom(obs$)` alternating in the same method.
- Requests that keep running, and results that are applied, after the user navigated away.
- Floating promises with no `await` and no error handling.

## Common causes

- Preferring `async/await` syntax and applying it to every asynchronous value.
- Migrating code from `fetch`-based code bases.
- Avoiding RxJS operators because they feel unfamiliar.

## Why it is a problem

- **No cancellation**: a promise cannot be cancelled; once a request is turned into a promise, switching route or
  typing a new search term cannot abort it, and stale results win races.
- **Lifetime leaks**: `await` continuations run after the component is destroyed.
- **Semantics changes**: `toPromise()` resolves with the *last* value and `undefined` on empty completion; awaiting a
  stream that never completes hangs forever.
- **Errors lost**: rejections in `async` subscribe callbacks are not handled by the observable's error channel.

## How it works under the hood

An observable is lazy and cancellable: subscribing starts the work, unsubscribing tears it down (for `HttpClient`,
it aborts the request). A promise is eager and has no cancellation: it represents a value already being produced.
`firstValueFrom()` subscribes, resolves on the first value and unsubscribes; `lastValueFrom()` waits for completion;
both reject with `EmptyError` if the stream completes without values, which is why they replaced the ambiguous
`toPromise()` (deprecated in RxJS 7). Inside a `subscribe` callback, an `async` function returns a promise that RxJS
ignores, so its errors become unhandled rejections and its timing is detached from the stream. Operators such as
`switchMap` accept promises too, so a promise-returning API can be composed *into* a stream without leaving it.

## Example (smelly)

```ts
export class CustomerSearch {
  private readonly api = inject(CustomerApi);
  readonly results = signal<Customer[]>([]);

  constructor() {
    inject(SearchBox).term$.subscribe(async term => {       // SMELL: async subscribe callback
      // SMELL: deprecated toPromise; requests can no longer be cancelled
      const customers = await this.api.search(term).toPromise();
      const enriched = await firstValueFrom(from(this.api.enrich(customers ?? [])));
      this.results.set(enriched);                           // stale term may overwrite a newer one
    });
  }
}
```

## Solution (refactored)

```ts
export class CustomerSearch {
  private readonly api = inject(CustomerApi);

  // REFACTOR: one stream; switchMap cancels the previous search, promises are composed in
  readonly results = toSignal(
    inject(SearchBox).term$.pipe(
      debounceTime(200),
      switchMap(term => this.api.search(term)),
      switchMap(customers => this.api.enrich(customers)), // enrich() may return a Promise
    ),
    { initialValue: [] },
  );
}
```

## Recommended refactorings

- **Stay in the observable world** for streams and anything that may need cancellation; compose with `switchMap`.
- **Convert at the boundary only**, with `firstValueFrom()` / `lastValueFrom()`, for genuinely one-shot calls (route
  guards, resolvers, initialization).
- Replace `toPromise()` with `firstValueFrom()` or `lastValueFrom()` explicitly.
- For signal-based components, consider `toSignal()` or a resource instead of manual `await`.

## When it may be acceptable

- APIs that are promise-based by nature (Web Crypto, IndexedDB wrappers) used in one-shot flows.
- Functional guards and resolvers, which accept promises.
- Tests, where `await firstValueFrom(obs$)` is a readable way to assert one value.

## Related smells

- [Nested Subscribes](./nested-subscribes.md)
- [Subscription Leak](./subscription-leak.md)
- [Fetch in Effect without Abort](../16-react-ts/fetch-race-condition.md)
- [Fake Async (Task.Run Wrapping)](../15-csharp/fake-async.md)
- [Callback Hell / Pyramid of Doom](../11-general/callback-hell.md)

## Automatic detection

- eslint-plugin-rxjs / rxjs-x: `no-topromise` and `no-async-subscribe`.
- typescript-eslint: `@typescript-eslint/no-floating-promises` and `@typescript-eslint/no-misused-promises`.
- TypeScript reports `toPromise()` as deprecated in editors.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/promise-observable-mixing/`](../../../angular/src/smells/angular_specific/promise-observable-mixing/)

## References

- RxJS — *Conversion to Promises*: https://rxjs.dev/deprecations/to-promise
- RxJS — `firstValueFrom`: https://rxjs.dev/api/index/function/firstValueFrom
- RxJS — `switchMap`: https://rxjs.dev/api/operators/switchMap
- Angular — *RxJS interop with Angular signals*: https://angular.dev/ecosystem/rxjs-interop
