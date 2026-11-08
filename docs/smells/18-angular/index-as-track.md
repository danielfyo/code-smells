# Tracking by Index

> **ID:** CS185 · **Category:** Angular-specific · **Sources:** angular.dev: @for track

## Definition

Using `track $index` in an `@for` block (or a `trackBy` returning the index with `*ngFor`) for a list that can be
reordered, filtered or have items inserted or removed. The track expression stops identifying the **item** and starts
identifying its **position**, so Angular reuses DOM nodes and component instances for the wrong items.

## Symptoms

- `@for (item of items(); track $index)` on a list with delete, sort or drag-and-drop.
- After removing the first row, the text typed into an `<input>` "jumps" to the next row.
- Child components keeping internal state (expanded, editing, animation) for the wrong item.
- Every row re-rendering when one item is inserted at the top.

## Common causes

- `track` is mandatory in `@for`, and `$index` is the quickest way to satisfy the compiler.
- Items without a stable identifier (created client-side without an id).
- Copying `track $index` from static examples.

## Why it is a problem

- **Mixed-up state**: DOM state (input values, focus, scroll) and child component state stay with the position.
- **Performance**: instead of moving one view, Angular updates the bindings of many views.
- **Subtle bugs**: they only show when reordering or deleting, which simple tests rarely do.

## How it works under the hood

`@for` keeps one embedded view per item. When the collection changes, Angular computes the track key of each new
item and reconciles it against the keys of the existing views: views whose key is still present are kept (and moved
if needed), missing keys are destroyed, new keys get fresh views. With `track $index`, the key of a view is its slot
number. Removing item 0 means slot 0 still exists, so its view, its DOM nodes and its child component instances are
reused and simply receive the bindings of the former item 1; the last slot is destroyed instead of the first. Tracking
by a domain identifier (`track item.id`) lets Angular see that exactly one view must be removed. Tracking by the object
itself (`track item`) works only while references are stable, and fails after data is re-fetched or copied
immutably.

## Example (smelly)

```ts
@Component({
  selector: 'app-guest-list',
  template: `
    <ul>
      @for (guest of guests(); track $index) {   <!-- SMELL: identity = position -->
        <li>
          {{ guest.name }} <input placeholder="Dietary note" />
          <button (click)="remove(guest.id)">Remove</button>
        </li>
      }
    </ul>
  `,
})
export class GuestList {
  readonly guests = signal<Guest[]>([]);
  remove(id: string): void { this.guests.update(gs => gs.filter(g => g.id !== id)); }
}
```

## Solution (refactored)

```ts
@Component({
  selector: 'app-guest-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      @for (guest of guests(); track guest.id) { <!-- REFACTOR: stable domain identity -->
        <li>
          {{ guest.name }} <input placeholder="Dietary note" />
          <button (click)="remove(guest.id)">Remove</button>
        </li>
      }
    </ul>
  `,
})
export class GuestList {
  readonly guests = signal<Guest[]>([]);
  remove(id: string): void { this.guests.update(gs => gs.filter(g => g.id !== id)); }
}
```

## Recommended refactorings

- **Track by a stable domain id** (`track item.id`, `track item.sku`).
- Assign an id when items are created client-side (`crypto.randomUUID()`), not during rendering.
- For legacy `*ngFor`, provide a `trackBy` function that returns the id, then migrate to `@for`.

## When it may be acceptable

- Static lists that are never reordered, filtered or edited, and whose rows hold no state.
- Lists of primitives without identity where duplicates are allowed and rows are stateless.

## Related smells

- [Mutating Inputs](./mutating-inputs.md)
- [Array Index as Key](../16-react-ts/index-as-key.md) — the same problem in React.
- [Obscured Intent / Clever Code](../11-general/obscured-intent.md)

## Automatic detection

- The compiler requires a `track` expression in `@for`; the extended diagnostic `uninvokedTrackFunction` catches
  track functions that are referenced but not called.
- angular-eslint: `@angular-eslint/template/use-track-by-function` requires `trackBy` on legacy `*ngFor`; it does
  not judge whether the key is stable.
- Code review or a simple search for `track $index`.
- Tests: type into a row, delete the row above, assert the text stays with its item.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/index-as-track/`](../../../angular/src/smells/angular_specific/index-as-track/)

## References

- Angular — *Control flow* (`@for` and `track`): https://angular.dev/guide/templates/control-flow
- Angular — *Extended diagnostics*: https://angular.dev/extended-diagnostics
- angular-eslint: https://github.com/angular-eslint/angular-eslint
