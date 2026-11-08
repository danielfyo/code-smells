# Fetch in Effect without Abort

> **ID:** CS150 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

Firing a network request inside a `useEffect` that depends on a parameter (id, search text) without cancelling or
ignoring the previous request when the parameter changes. If responses arrive out of order, a stale response
overwrites the newest one and the UI shows data that does not match the current selection.

## Symptoms

- `useEffect(() => { fetch(url).then(r => r.json()).then(setData) }, [query])` with no `return`.
- Search results that "flicker" or end up showing an earlier query.
- Warnings or state updates after the component has unmounted.

## Common causes

- Assuming responses arrive in the same order as requests were sent.
- Not knowing about effect cleanup functions or `AbortController`.

## Why it is a problem

- **Wrong data** shown to the user (another order's details, another search's results).
- **Wasted traffic**: obsolete requests keep consuming network and server resources.
- Non-deterministic, latency-dependent bugs that are hard to reproduce locally.

## How it works under the hood

Each dependency change runs the previous effect's cleanup and then the new effect, but the first `fetch` promise is
still alive and its `.then` will call `setData` when it resolves. The network guarantees no ordering: the request for
"re" may arrive after the one for "react". Cleanup fixes this in one of two ways: setting an `ignore = true` flag that
the callback checks (each effect run has its own closure and thus its own flag), or calling `AbortController.abort()`,
which cancels the request and rejects the promise with an `AbortError`.

## Example (smelly)

```tsx
function CustomerDetail({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetch(`/api/customers/${customerId}`)        // SMELL: no cancellation
      .then(r => r.json())
      .then(setCustomer);                        // a stale response may win
  }, [customerId]);

  return <h2>{customer?.name ?? 'Loading…'}</h2>;
}
```

## Solution (refactored)

```tsx
function CustomerDetail({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const controller = new AbortController();     // REFACTOR: one signal per run
    setCustomer(null);
    fetch(`/api/customers/${customerId}`, { signal: controller.signal })
      .then(r => r.json())
      .then(setCustomer)
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });
    return () => controller.abort();              // cancels the obsolete request
  }, [customerId]);

  return <h2>{customer?.name ?? 'Loading…'}</h2>;
}
```

## Recommended refactorings

- **Cancel with `AbortController`** in the effect cleanup.
- **An `ignore` flag** when the API does not support cancellation.
- **Extract a hook** (`useCustomer(id)`) that encapsulates loading, error and cancellation.
- Use a **data-fetching library** (TanStack Query, SWR) or the framework's data mechanism, which handle cancellation,
  caching and deduplication.

## When it may be acceptable

- Requests whose parameter never changes during the component's life and where unmounting does not matter (cleanup
  is still cheap and correct).

## Related smells

- [Missing Effect Cleanup](./missing-effect-cleanup.md)
- [Stale Closure / Missing Dependencies](./stale-closure.md)
- [Missing Context Propagation (Go)](../17-go/missing-context.md) — Go's cancellation equivalent.
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)

## Automatic detection

- No standard rule exists; `react-hooks/exhaustive-deps` ensures `customerId` is a dependency, not that it is cancelled.
- `<StrictMode>` in development double-invokes the effect and helps surface requests without cleanup.
- Tests with mocked responses that resolve in reverse order (e.g. MSW with delays).

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/fetch-race-condition/`](../../../react-ts/src/smells/react_ts_specific/fetch-race-condition/)

## References

- React — *Synchronizing with Effects* (fetching data): https://react.dev/learn/synchronizing-with-effects
- React — *You Might Not Need an Effect* (fetching data): https://react.dev/learn/you-might-not-need-an-effect
- MDN — `AbortController`: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
