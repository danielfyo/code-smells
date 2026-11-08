# Missing Effect Cleanup

> **ID:** CS137 · **Category:** React + TS-specific · **Sources:** react.dev

## Definition

A `useEffect` that creates a subscription, timer, listener or connection and does not return a cleanup function to
undo it. The resource outlives the component's unmount, or is duplicated every time the effect re-runs.

## Symptoms

- `setInterval`, `addEventListener`, `subscribe`, `new WebSocket` inside an effect with no `return () => ...`.
- Warnings or errors from updating state of unmounted components; callbacks that fire twice.
- In development with `<StrictMode>`, duplicated events (React deliberately mounts, unmounts and remounts).
- Memory or CPU usage that grows as the user navigates between screens.

## Common causes

- Thinking of an effect as "runs on mount" instead of "synchronises with an external system".
- Copying incomplete examples.

## Why it is a problem

- **Memory leaks**: the listener's closure retains the component and its data.
- **Duplicated work**: every re-run adds another interval or listener.
- **Wrong behaviour**: stale handlers keep reacting to events.

## How it works under the hood

React runs the effect body after the commit. If the effect returns a function, React calls it **before re-running the
effect** (when its dependencies change) and **on unmount**. Each run is therefore paired with its cleanup: setup →
cleanup → setup → ... → cleanup. In development, `StrictMode` runs an extra setup → cleanup → setup cycle so that a
missing cleanup becomes visible straight away. Without cleanup nothing stops the resource: the browser keeps invoking
the callback, which keeps alive everything it captures.

## Example (smelly)

```tsx
function StockTicker({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    setInterval(async () => {                     // SMELL: never cleared
      const res = await fetch(`/api/price/${symbol}`);
      setPrice((await res.json()).price);
    }, 1000);
    window.addEventListener('focus', () => setPrice(null)); // SMELL: listeners pile up
  }, [symbol]);

  return <span>{price ?? '—'}</span>;
}
```

## Solution (refactored)

```tsx
function StockTicker({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(`/api/price/${symbol}`);
      setPrice((await res.json()).price);
    }, 1000);
    const onFocus = () => setPrice(null);
    window.addEventListener('focus', onFocus);
    return () => {                                 // REFACTOR: cleanup mirrors setup
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [symbol]);

  return <span>{price ?? '—'}</span>;
}
```

## Recommended refactorings

- **Always return a cleanup that mirrors the setup** (`subscribe`/`unsubscribe`, `add`/`removeEventListener`).
- For requests, cancel with `AbortController` (see [Fetch in Effect without Abort](./fetch-race-condition.md)).
- **Extract a custom hook** (`useInterval`, `useWindowEvent`) that encapsulates the setup/cleanup pair.
- For external stores, use `useSyncExternalStore`.

## When it may be acceptable

- Effects that create no resources (e.g. logging an analytics event once).
- Root components that live as long as the app, although cleaning up still keeps tests deterministic.

## Related smells

- [Fetch in Effect without Abort](./fetch-race-condition.md)
- [Stale Closure / Missing Dependencies](./stale-closure.md)
- [Goroutine Leak](../17-go/goroutine-leak.md) — the same orphaned-resource problem in Go.
- [Side Effects](../07-functions/side-effects.md)

## Automatic detection

- `react-hooks/exhaustive-deps` does not detect missing cleanups.
- `<StrictMode>` in development surfaces effects without cleanup (double invocation).
- Tests with `@testing-library/react`: `unmount()` plus fake timers to assert no callbacks remain.

## Implementations

React + TypeScript-specific smell:

- React + TS: [`react-ts/src/smells/react_ts_specific/missing-effect-cleanup/`](../../../react-ts/src/smells/react_ts_specific/missing-effect-cleanup/)

## References

- React — *Synchronizing with Effects*: https://react.dev/learn/synchronizing-with-effects
- React — *Lifecycle of Reactive Effects*: https://react.dev/learn/lifecycle-of-reactive-effects
- React — `useEffect`: https://react.dev/reference/react/useEffect
- React — `useSyncExternalStore`: https://react.dev/reference/react/useSyncExternalStore
