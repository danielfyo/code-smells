# Manual Change Detection Hacks

> **ID:** CS182 · **Category:** Angular-specific · **Sources:** angular.dev: change detection

## Definition

`ChangeDetectorRef.detectChanges()`, `markForCheck()`, `setTimeout(() => ...)`, `NgZone.run()` or
`ApplicationRef.tick()` sprinkled through components to force the view to show a value, usually to work around
`ExpressionChangedAfterItHasBeenChecked` or an `OnPush` view that "does not update". The hack treats the symptom;
the real cause is state that Angular is not notified about.

## Symptoms

- `this.cdr.detectChanges()` right after assigning a field.
- `setTimeout(() => this.loading = false)` or `Promise.resolve().then(...)` with no functional reason.
- Comments such as "needed or the view does not refresh".
- Specs that need extra `fixture.detectChanges()` calls in odd places to pass.
- Views that break when the application moves to zoneless change detection.

## Common causes

- Mutating objects or arrays in place while using `OnPush`.
- Updating parent state from a child's lifecycle hook during the same check (NG0100).
- Callbacks from third-party libraries running outside Angular's knowledge.

## Why it is a problem

- **Fragile**: the code depends on timing and on the order of checks; small changes break it.
- **Extra work**: `detectChanges()` runs a synchronous check of the subtree, sometimes several per event.
- **Not zoneless-safe**: under zoneless, `setTimeout` no longer triggers change detection at all, so the hack silently
  stops working.
- **Masks design problems**: mutable or misplaced state remains in place.

## How it works under the hood

`detectChanges()` synchronously checks the component's view and its children, right now, outside the normal tick.
`markForCheck()` marks the view and all its ancestors as dirty so that the next tick visits them; in zoneless mode it
also schedules that tick. `setTimeout` worked as a hack only because zone.js intercepts timers and runs
`ApplicationRef.tick()` afterwards, giving a second pass in which a value changed during the first pass is finally
rendered. In development, Angular runs a verification pass after each check and throws NG0100 if a binding changed;
deferring the change hides the error instead of fixing the data flow.

Signals remove the need for all of this: writing a signal that a template reads marks that view for refresh and
schedules change detection, regardless of `OnPush`, zone.js or where the write happened.

## Example (smelly)

```ts
@Component({
  selector: 'app-invoice-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ status }}</p>`,
})
export class InvoiceStatus implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly api = inject(InvoiceApi);
  status = 'loading';

  ngOnInit(): void {
    this.api.status('INV-7').then(s => {
      this.status = s;
      this.cdr.detectChanges();            // SMELL: forcing a check after a plain assignment
    });
    setTimeout(() => (this.status += '.')); // SMELL: relies on zone.js to re-render
  }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-invoice-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ status() }}</p>`,
})
export class InvoiceStatus {
  private readonly api = inject(InvoiceApi);
  readonly status = signal('loading'); // REFACTOR: signal notifies the view itself

  constructor() {
    this.api.status('INV-7').then(s => this.status.set(s)); // no cdr, no setTimeout
  }
}
```

## Recommended refactorings

- **Replace mutable fields with signals**; derive with `computed()`.
- Bind observables with the `async` pipe or `toSignal()`, which notify Angular correctly.
- **Fix NG0100 at the source**: compute the value before the view is checked, or move it into a `computed()`,
  instead of deferring the assignment.
- Use `afterNextRender()` for code that genuinely needs the rendered DOM.

## When it may be acceptable

- Integrations with imperative widgets or callbacks that Angular cannot observe; prefer setting a signal there.
- `markForCheck()` inside a library component that cannot depend on signals yet.
- Performance-critical code that detaches a view and checks it on its own schedule, with a comment explaining why.

## Related smells

- [Default Change Detection Everywhere](./default-change-detection.md)
- [Public Mutable Service State](./mutable-service-state.md)
- [Mutating Inputs](./mutating-inputs.md)
- [Overridden Safeties](../08-error-handling/overridden-safeties.md)
- [Sleepy Test](../12-tests/sleepy-test.md) — the same "wait and hope" approach in tests.

## Automatic detection

- No dedicated angular-eslint rule; ESLint `no-restricted-syntax` can flag calls to `detectChanges` or
  `setTimeout` in component files.
- Running the specs zoneless with `await fixture.whenStable()` exposes views that only updated thanks to zone.js.
- Development mode reports NG0100 errors that the hacks were hiding once they are removed.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/manual-change-detection/`](../../../angular/src/smells/angular_specific/manual-change-detection/)

## References

- Angular — *Zoneless*: https://angular.dev/guide/zoneless
- Angular — *Skipping component subtrees*: https://angular.dev/best-practices/skipping-subtrees
- Angular — `ChangeDetectorRef`: https://angular.dev/api/core/ChangeDetectorRef
- Angular — *Signals*: https://angular.dev/guide/signals
