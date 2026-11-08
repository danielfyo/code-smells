# Default Change Detection Everywhere

> **ID:** CS181 · **Category:** Angular-specific · **Sources:** angular.dev: OnPush and zoneless

## Definition

Components declared without `changeDetection: ChangeDetectionStrategy.OnPush` and without signal-driven state, so
Angular checks them on **every** change detection pass, triggered by any event anywhere in the application, even when
nothing they display has changed.

## Symptoms

- `@Component` decorators with no `changeDetection` property (or explicitly `ChangeDetectionStrategy.Default`).
- Plain mutable fields bound in templates and mutated from callbacks.
- Angular DevTools profiler showing the whole component tree being checked on a single keystroke.
- Jank in large lists or dashboards when typing, scrolling or receiving WebSocket messages.
- Code that "only works" because some unrelated event triggers a global check.

## Common causes

- `Default` is what you get when you do not opt in, and older CLI schematics did not add `OnPush`.
- Mutable state patterns (mutating arrays and objects in place) that break under `OnPush`.
- Fear that `OnPush` "stops the view updating", usually caused by mutation.

## Why it is a problem

- **Performance**: cost grows with the size of the whole tree, not with what changed.
- **Hidden coupling**: views update by accident because another component triggered a check; moving to `OnPush` or
  zoneless suddenly "breaks" them.
- **Harder migration to zoneless**: a zoneless application only checks when something notifies Angular; code relying
  on implicit global checks stops updating.

## How it works under the hood

Change detection walks the component tree from the root, evaluating each view's template bindings. With zone.js,
`NgZone` patches async APIs (events, timers, promises, XHR) and calls `ApplicationRef.tick()` after each of them.
In zoneless mode (the default for new applications in recent Angular versions, enabled with
`provideZonelessChangeDetection()`), a tick is **scheduled** only by notifications: a signal read in a template
changing, `markForCheck()` (which the `async` pipe calls), a template or host event listener, or `setInput()`.

A `Default` component is checked on every tick that reaches it. An `OnPush` component is skipped, together with its
subtree, unless it is dirty: one of its inputs received a new reference from a template binding, an event was handled
in it or its children, it was marked with `markForCheck()`, or a signal it reads in its template changed. Signals
are even more precise: a signal change marks only the consuming view for refresh, and ancestors are traversed without
re-checking them.

## Example (smelly)

```ts
@Component({
  selector: 'app-stock-badge',
  // SMELL: no OnPush; checked on every tick in the whole app
  template: `<span [class.low]="stock < 5">{{ stock }} in stock</span>`,
})
export class StockBadge implements OnInit {
  private readonly inventory = inject(InventoryService);
  stock = 0;

  ngOnInit(): void {
    // updates a plain field; relies on zone.js triggering a global check
    this.inventory.stockFor('SKU-1').subscribe(n => (this.stock = n));
  }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-stock-badge',
  changeDetection: ChangeDetectionStrategy.OnPush, // REFACTOR: skipped unless dirty
  template: `<span [class.low]="stock() < 5">{{ stock() }} in stock</span>`,
})
export class StockBadge {
  readonly sku = input.required<string>();
  private readonly inventory = inject(InventoryService);

  // REFACTOR: signal state notifies Angular precisely, with or without zone.js
  readonly stock = toSignal(
    toObservable(this.sku).pipe(switchMap(sku => this.inventory.stockFor(sku))),
    { initialValue: 0 },
  );
}
```

## Recommended refactorings

- **Add `OnPush`** to every component, starting from leaves and presentational components.
- **Replace mutable fields with signals** (`signal`, `computed`, `input()`), or bind observables with `async`.
- **Update state immutably** so new references flow through inputs.
- Configure the CLI schematics (`angular.json`) to generate `OnPush` components by default.
- Move to **zoneless** once components no longer rely on implicit checks.

## When it may be acceptable

- Tiny applications or prototypes where performance is irrelevant.
- Legacy components that wrap imperative third-party widgets while they are being migrated.

## Related smells

- [Manual Change Detection Hacks](./manual-change-detection.md)
- [Function Calls in Templates](./function-calls-in-template.md)
- [Public Mutable Service State](./mutable-service-state.md)
- [Mutating Inputs](./mutating-inputs.md)
- [Mutable Data](../06-data/mutable-data.md)

## Automatic detection

- angular-eslint: `@angular-eslint/prefer-on-push-component-change-detection`.
- Angular DevTools profiler: inspect which components are checked per cycle.
- Running the specs zoneless (`provideZonelessChangeDetection()`) exposes views that depended on zone.js.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/default-change-detection/`](../../../angular/src/smells/angular_specific/default-change-detection/)

## References

- Angular — *Skipping component subtrees*: https://angular.dev/best-practices/skipping-subtrees
- Angular — *Zoneless*: https://angular.dev/guide/zoneless
- Angular — *Signals*: https://angular.dev/guide/signals
- angular-eslint: https://github.com/angular-eslint/angular-eslint
