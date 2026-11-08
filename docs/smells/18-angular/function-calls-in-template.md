# Function Calls in Templates

> **ID:** CS179 · **Category:** Angular-specific · **Sources:** angular.dev: computed signals and pure pipes

## Definition

Template bindings that call ordinary component methods to compute values — `{{ total() }}` where `total()` reduces an
array, `[class.late]="isLate(order)"`, `@if (canEdit(user))`. The method runs again every time Angular checks the
view, whether or not its inputs changed. Reading a **signal** (`count()`) is not this smell: it is a cheap memoized
getter.

## Symptoms

- Methods such as `getTotal()`, `formatPrice(x)`, `filteredItems()` used in interpolations, bindings or `@for`.
- A `console.log` inside the method prints dozens of times per click or keystroke.
- Slow typing or scrolling on screens with large lists.
- Methods that allocate (`filter`, `map`, `new Date()`) inside bindings, causing new references on every check.

## Common causes

- Treating the template like a function body that runs once.
- Avoiding the boilerplate of a pipe or of storing derived state.
- Migrating from AngularJS or from frameworks with different update models.

## Why it is a problem

- **Wasted work**: the method's cost is multiplied by the number of change detection cycles and list rows.
- **Hidden side effects**: a method that mutates state or logs inside a binding behaves unpredictably and may trigger
  `ExpressionChangedAfterItHasBeenChecked` (NG0100) in development.
- **Unstable references**: returning a new array or object each time makes child inputs always "change".

## How it works under the hood

The compiler turns each template into creation and **update** instructions. Every time the view is checked, the
update block evaluates every binding expression and compares the result with the previous value stored in the view
(`Object.is`); only differences reach the DOM. Angular cannot know a method is pure, so it calls it on every check.
With `Default` change detection under zone.js, a check happens after any event, timer or XHR anywhere in the app.

A `computed()` signal is lazy and memoized: it records which signals it read, and recomputes only when one of those
producers reports a new version. A **pure pipe** is invoked only when its input references change. Both turn "run on
every check" into "run when the data changes".

## Example (smelly)

```ts
@Component({
  selector: 'app-cart-summary',
  template: `
    <p>Items: {{ itemCount() }}</p>
    <p>Total: {{ total() | currency: 'EUR' }}</p>  <!-- SMELL: recomputed on every check -->
    @for (line of expensiveLines(); track line.sku) { <li>{{ line.name }}</li> }
  `,
})
export class CartSummary {
  readonly lines = input.required<CartLine[]>();

  itemCount(): number { return this.lines().reduce((n, l) => n + l.qty, 0); }
  total(): number { return this.lines().reduce((s, l) => s + l.qty * l.price, 0); }
  expensiveLines(): CartLine[] { return this.lines().filter(l => l.price > 100); } // new array each call
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-cart-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <p>Items: {{ itemCount() }}</p>
    <p>Total: {{ total() | currency: 'EUR' }}</p>
    @for (line of expensiveLines(); track line.sku) { <li>{{ line.name }}</li> }
  `,
})
export class CartSummary {
  readonly lines = input.required<CartLine[]>();
  // REFACTOR: computed signals recompute only when `lines` changes
  readonly itemCount = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  readonly total = computed(() => this.lines().reduce((s, l) => s + l.qty * l.price, 0));
  readonly expensiveLines = computed(() => this.lines().filter(l => l.price > 100));
}
```

## Recommended refactorings

- **Replace method with `computed()`** for values derived from signals or signal inputs.
- **Extract a pure pipe** for reusable per-item formatting (`orderStatusLabel`, `initials`).
- **Precompute view models** in the service or component (map the data once when it arrives).
- Combine with **OnPush** so the view is checked only when it is dirty.

## When it may be acceptable

- Signal reads and trivial getters with no allocation (`isOpen()` returning a field).
- Small, static views where profiling shows no cost; still, prefer `computed()` for consistency.
- Event bindings (`(click)="save()"`) are not this smell: they run on the event, not on every check.

## Related smells

- [Default Change Detection Everywhere](./default-change-detection.md)
- [effect() for Derived State](./effect-for-derived-state.md)
- [Premature Memoization](../16-react-ts/premature-memoization.md) — the opposite extreme in React.
- [Side Effects](../07-functions/side-effects.md)

## Automatic detection

- angular-eslint: `@angular-eslint/template/no-call-expression` (configure its allow list so signal reads are
  accepted).
- Angular DevTools profiler: shows the time spent in each component's change detection.
- Development mode reports NG0100 when a binding returns a different value on the verification pass.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/function-calls-in-template/`](../../../angular/src/smells/angular_specific/function-calls-in-template/)

## References

- Angular — *Signals* (computed signals): https://angular.dev/guide/signals
- Angular — *Pipes*: https://angular.dev/guide/templates/pipes
- Angular — *Skipping component subtrees*: https://angular.dev/best-practices/skipping-subtrees
- angular-eslint: https://github.com/angular-eslint/angular-eslint
