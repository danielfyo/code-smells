# effect() for Derived State

> **ID:** CS191 · **Category:** Angular-specific · **Sources:** angular.dev: computed signals

## Definition

Using `effect()` to read some signals and write the result into another signal (`effect(() => this.total.set(...))`)
when the value is a pure function of its sources and could be declared with `computed()`. The derived value becomes
writable state that is updated late and can be overwritten by anyone.

## Symptoms

- `effect()` bodies whose only statement is `someSignal.set(f(otherSignals))`.
- Writable signals that are never set by user actions, only by effects.
- Brief inconsistent states: the source changed but the "derived" signal still holds the old value.
- Chains of effects where one effect's write triggers the next.
- The legacy `allowSignalWrites: true` option, needed in older versions to permit this.

## Common causes

- Thinking of `effect()` as "watch" from other frameworks.
- Porting React `useEffect` + `setState` habits.
- Not knowing `linkedSignal()` for derived state that the user can also override.

## Why it is a problem

- **Glitches**: between the source update and the effect run, readers see stale derived values.
- **Extra work**: effects are scheduled and run even if nobody reads the result; each write can schedule more
  change detection.
- **Two sources of truth**: the derived signal can be `set()` from elsewhere and drift from its sources.
- **Harder reasoning**: dependencies are implicit and cascades are possible.

## How it works under the hood

Signals form a dependency graph. A `computed()` is a **pull-based**, lazy node: it records the producers it reads,
caches its value, and when a producer changes it is only marked dirty; it recomputes on the next read, so readers
always see a consistent ("glitch-free") value and unread computeds cost nothing. An `effect()` is a consumer that is
**scheduled**: component effects run during change detection, root effects as part of the application's scheduling,
never synchronously with the write. Writing a signal inside an effect therefore creates a second propagation round:
the template may be checked with the old value, then the effect writes, then another check is needed. `effect()` is
meant for synchronising with the outside world (logging, `localStorage`, imperative APIs). `linkedSignal()` covers the
case of state that resets from a source but can also be edited locally.

## Example (smelly)

```ts
@Component({
  selector: 'app-invoice-totals',
  template: `<p>Net {{ net() }} · VAT {{ vat() }} · Gross {{ gross() }}</p>`,
})
export class InvoiceTotals {
  readonly lines = input.required<InvoiceLine[]>();
  readonly net = signal(0);
  readonly vat = signal(0);
  readonly gross = signal(0);

  constructor() {
    // SMELL: derived values pushed through effects; stale between runs and writable from anywhere
    effect(() => this.net.set(this.lines().reduce((s, l) => s + l.qty * l.price, 0)));
    effect(() => this.vat.set(this.net() * 0.21));
    effect(() => this.gross.set(this.net() + this.vat()));
  }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-invoice-totals',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Net {{ net() }} · VAT {{ vat() }} · Gross {{ gross() }}</p>`,
})
export class InvoiceTotals {
  readonly lines = input.required<InvoiceLine[]>();
  // REFACTOR: computed signals are lazy, memoized, read-only and always consistent
  readonly net = computed(() => this.lines().reduce((s, l) => s + l.qty * l.price, 0));
  readonly vat = computed(() => this.net() * 0.21);
  readonly gross = computed(() => this.net() + this.vat());
}
```

## Recommended refactorings

- **Replace effect + set with `computed()`** for pure derivations.
- **Use `linkedSignal()`** when the derived value must also be locally writable (e.g. a selected item that resets
  when the list changes).
- Keep `effect()` for side effects that leave the signal graph; use `untracked()` for reads that must not become
  dependencies.

## When it may be acceptable

- Writing to a signal from an effect when the value comes from an imperative or asynchronous external source that is
  not itself a signal.
- Persisting state (`localStorage`) or syncing with a non-Angular widget: that is the intended use of `effect()`.

## Related smells

- [Function Calls in Templates](./function-calls-in-template.md)
- [Manual Change Detection Hacks](./manual-change-detection.md)
- [Derived State via useEffect](../16-react-ts/derived-state-in-effect.md) — the same smell in React.
- [Chains of Effects](../16-react-ts/effect-chains.md)
- [Side Effects](../07-functions/side-effects.md)

## Automatic detection

- No dedicated angular-eslint rule; ESLint `no-restricted-syntax` with a selector for `.set(` calls inside `effect(`
  callbacks can approximate it.
- Code review: effects whose body only calls `set()` / `update()` with values computed from other signals.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/effect-for-derived-state/`](../../../angular/src/smells/angular_specific/effect-for-derived-state/)

## References

- Angular — *Signals* (computed signals and effects): https://angular.dev/guide/signals
- Angular — *Dependent state with linkedSignal*: https://angular.dev/guide/signals/linked-signal
- angular-eslint: https://github.com/angular-eslint/angular-eslint
