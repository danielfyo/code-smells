# Public Mutable Service State

> **ID:** CS184 · **Category:** Angular-specific · **Sources:** angular.dev: signals

## Definition

An injectable service that exposes mutable arrays or objects as public fields (`cart.items: CartItem[]`,
`session.user`) so any component can change them directly. Nobody is notified of the change, there is no single place
that enforces the rules, and `OnPush` / signal-based views do not update.

## Symptoms

- `this.cartService.items.push(item)` or `this.session.user.name = ...` in components.
- Public, non-readonly fields on services holding domain state.
- Exposed `BehaviorSubject`s that any consumer can call `.next()` on.
- Views that show stale data until something unrelated triggers a refresh.
- Bugs whose cause is "some component changed the list" and nobody knows which one.

## Common causes

- Services used as global variable bags.
- Convenience over encapsulation in early prototypes.
- Not knowing how to expose read-only signals.

## Why it is a problem

- **No notification**: in-place mutation changes no reference, so signals, `OnPush` views and `computed()` values do
  not react.
- **No invariants**: business rules (maximum quantity, no duplicates) cannot be enforced when everyone writes.
- **Global coupling**: every component depends on the internal shape of the service's data.
- **Hard debugging**: there is no single method to set a breakpoint in.

## How it works under the hood

A root service (`providedIn: 'root'`) is a singleton for the application injector: every component that injects it
shares the same object, which makes a public mutable field effectively global data. Signals detect changes with an
equality check (`Object.is` by default): `items.push()` on the array held by a signal keeps the same reference, so the
signal does not notify its consumers and `computed()` values depending on it stay cached. `OnPush` components
likewise only react to new input references. The idiomatic pattern is a private `WritableSignal`, a public read-only
view via `asReadonly()`, `computed()` for derived values, and intention-revealing methods that use `update()` to
produce a **new** array or object.

## Example (smelly)

```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  items: CartItem[] = []; // SMELL: public, mutable, no notification
}

@Component({
  selector: 'app-add-to-cart',
  template: `<button (click)="add()">Add</button>`,
})
export class AddToCart {
  readonly product = input.required<Product>();
  private readonly cart = inject(CartService);

  add(): void {
    this.cart.items.push({ sku: this.product().sku, qty: 1 }); // SMELL: mutation from outside
  }
}
```

## Solution (refactored)

```ts
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<readonly CartItem[]>([]); // REFACTOR: private writable state
  readonly items = this._items.asReadonly();                 // REFACTOR: read-only view
  readonly count = computed(() => this._items().reduce((n, i) => n + i.qty, 0));

  add(sku: string): void {                                   // REFACTOR: one place for the rules
    this._items.update(items => {
      const found = items.find(i => i.sku === sku);
      return found
        ? items.map(i => (i.sku === sku ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { sku, qty: 1 }];
    });
  }
}
```

## Recommended refactorings

- **Encapsulate Field / Encapsulate Collection**: make state private, expose `asReadonly()` signals or observables
  (`subject.asObservable()`).
- **Replace mutation with immutable updates** through `update()`.
- **Introduce intention-revealing methods** (`add`, `remove`, `clear`) that enforce invariants.
- Type exposed collections as `readonly T[]` / `ReadonlyArray<T>`.

## When it may be acceptable

- Configuration objects that are set once at bootstrap and never change.
- Private services used by a single component, where the component is the only writer.

## Related smells

- [Mutating Inputs](./mutating-inputs.md)
- [Default Change Detection Everywhere](./default-change-detection.md)
- [Global Data](../05-couplers/global-data.md)
- [Mutable Data](../06-data/mutable-data.md)
- [Exposing Mutable Collections](../15-csharp/exposed-mutable-collections.md)

## Automatic detection

- typescript-eslint: `@typescript-eslint/prefer-readonly` (private members never reassigned) and
  `@typescript-eslint/prefer-readonly-parameter-types` (stricter, flags mutable parameter types).
- eslint-plugin-rxjs / rxjs-x: `no-exposed-subjects` flags public `Subject`s.
- angular-eslint: `@angular-eslint/prefer-signals` encourages signal-based state.
- Code review: public non-readonly fields on `@Injectable` classes.

## Implementations

Angular-specific smell:

- Angular: [`angular/src/smells/angular_specific/mutable-service-state/`](../../../angular/src/smells/angular_specific/mutable-service-state/)

## References

- Angular — *Signals*: https://angular.dev/guide/signals
- Angular — *Dependency injection*: https://angular.dev/guide/di
- Angular — *Skipping component subtrees*: https://angular.dev/best-practices/skipping-subtrees
- angular-eslint: https://github.com/angular-eslint/angular-eslint
