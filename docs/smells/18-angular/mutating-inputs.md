# Mutating Inputs

> **ID:** CS192 · **Category:** Angular-specific · **Sources:** angular.dev: inputs

## Definition

A child component that changes an object or array it received through an input — `this.order().status = 'paid'`,
`this.items().push(x)` — instead of notifying the parent with an `output()` (or a `model()`). The parent's state is
changed behind its back, without any notification, breaking one-way data flow.

## Symptoms

- Assignments to properties of input values (`this.order().lines[0].qty++`).
- `push`, `splice`, `sort` called on input arrays.
- Parent views or `computed()` values that do not reflect a change made in the child until something else happens.
- Child components that cannot be reused because they assume they may edit their inputs.

## Common causes

- Inputs are passed by reference, so mutation "just works" with `Default` change detection.
- Avoiding the boilerplate of an output and a handler in the parent.
- Confusing two-way binding with shared mutable objects.

## Why it is a problem

- **Invisible changes**: signals, `computed()` and `OnPush` views in the parent do not notice in-place mutation.
- **Ownership violation**: the parent can no longer validate, persist or undo changes.
- **Debugging**: state changes come from unexpected places, and with shared references a mutation in one child leaks
  into siblings.

## How it works under the hood

Template bindings pass references: the child's input signal holds the same object the parent stores. When the child
mutates it, no binding changes: the reference is identical, so Angular's input update does not run, the parent's
`signal` keeps the same value (equality is `Object.is`), dependent `computed()` values stay cached, and `OnPush`
views are not marked dirty. Under `Default` change detection the mutation may happen to appear on screen on the next
global check, which hides the bug until the app adopts `OnPush` or zoneless. Signal inputs are read-only from the
child's side (`InputSignal` has no `set()`), which nudges toward the correct design: emit an event and let the owner
produce a new, immutable value. `model()` is the explicit tool when two-way binding is really intended.

## Example (smelly)

```ts
@Component({
  selector: 'app-order-line-editor',
  template: `<button (click)="increment()">+1</button> {{ line().qty }}`,
})
export class OrderLineEditor {
  readonly line = input.required<OrderLine>();

  increment(): void {
    this.line().qty++; // SMELL: mutates the parent's object; parent signals and totals never update
  }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-order-line-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="qtyChange.emit(line().qty + 1)">+1</button> {{ line().qty }}`,
})
export class OrderLineEditor {
  readonly line = input.required<Readonly<OrderLine>>(); // REFACTOR: read-only contract
  readonly qtyChange = output<number>();                 // REFACTOR: notify the owner
}

// Parent: owns the state and updates it immutably
// <app-order-line-editor [line]="l" (qtyChange)="setQty(l.id, $event)" />
setQty(id: string, qty: number): void {
  this.lines.update(ls => ls.map(l => (l.id === id ? { ...l, qty } : l)));
}
```

## Recommended refactorings

- **Replace mutation with an `output()`** and let the parent apply an immutable update.
- **Use `model()`** for deliberate two-way binding of a value the parent owns.
- Type inputs as `Readonly<T>` / `ReadonlyArray<T>` so the compiler rejects mutation.
- If the child needs a local, editable copy, make it explicit (`linkedSignal()` from the input) and emit on save.

## When it may be acceptable

- Inputs that are deliberately mutable handles (e.g. a `FormGroup` passed to a sub-form component), where mutation
  through the object's own API is the contract.
- Performance-critical code with documented ownership, which is rare in UI code.

## Related smells

- [Public Mutable Service State](./mutable-service-state.md)
- [Tracking by Index](./index-as-track.md)
- [Direct State Mutation](../16-react-ts/direct-state-mutation.md) — the React counterpart.
- [Mutable Data](../06-data/mutable-data.md)
- [Output Arguments](../07-functions/output-arguments.md)

## Automatic detection

- TypeScript: `Readonly<T>` / `readonly` arrays turn mutations into compile errors.
- typescript-eslint: `@typescript-eslint/prefer-readonly-parameter-types` (strict, mostly for functions).
- Specs with `OnPush` / zoneless that assert the parent's derived values after a child interaction.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/mutating-inputs/`](../../../angular/src/smells/angular_specific/mutating-inputs/)

## References

- Angular — *Inputs*: https://angular.dev/guide/components/inputs
- Angular — *Outputs*: https://angular.dev/guide/components/outputs
- Angular — *Signals*: https://angular.dev/guide/signals
- Angular — *Skipping component subtrees*: https://angular.dev/best-practices/skipping-subtrees
