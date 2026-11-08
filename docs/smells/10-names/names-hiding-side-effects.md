# Names Should Describe Side-Effects

> **ID:** CS062 · **Category:** Names · **Sources:** Clean Code N7

*A getX() that also creates, saves or modifies things without its name saying so.*

## Definition

A name describes only part of what the function does and hides side effects: `getSession()` that creates a
session if none exists, `getTotal()` that also persists the result, `validate()` that fixes the data.
*Clean Code* (N7, *Names Should Describe Side-Effects*) uses the example of `getOos()`, which creates the
object if it does not exist and should be called `createOrReturnOos()`.

## Symptoms

- `get`/`find`/`is`/`calculate` methods that write to the database, send messages or change state.
- Calling a "getter" in an expression changes the result of later calls.
- Bugs that appear or disappear when a log line calling the "getter" is added or removed.
- Tests that need persistence mocks to test a method that looks like a query.

## Common causes

- Lazy initialization or caches added later without renaming.
- Shortcuts to "make the most" of a call by doing something extra.

## Why it is a problem

- **Surprises**: callers do not expect a query to change the system.
- **Ordering bugs**: calling twice or in another order produces different results.
- The method cannot be used safely in logs, debuggers or views.

## Example (smelly)

```typescript
class CartStore {
  // SMELL: looks like a query, but creates and persists a cart
  getCart(userId: string): Cart {
    let cart = this.carts.get(userId);
    if (!cart) {
      cart = new Cart(userId);
      this.carts.set(userId, cart);
      this.storage.save(cart);
    }
    return cart;
  }
}
```

## Solution (refactored)

```typescript
class CartStore {
  // REFACTOR: pure query
  findCart(userId: string): Cart | undefined {
    return this.carts.get(userId);
  }

  // REFACTOR: the name announces the side effect
  getOrCreateCart(userId: string): Cart {
    const existing = this.findCart(userId);
    if (existing) return existing;
    const cart = new Cart(userId);
    this.carts.set(userId, cart);
    this.storage.save(cart);
    return cart;
  }
}
```

## Recommended refactorings

- **Separate Query from Modifier**.
- **Change Function Declaration** so the name includes the effect (`getOrCreate`, `loadAndCache`).
- **Extract Function** to isolate the side effect and call it explicitly.

## When it may be acceptable

- Transparent caches or memoization that do not change the observable result (idempotent).
- Well-known named patterns (`GetOrAdd` on `ConcurrentDictionary`, `setdefault` in Python) where the convention already announces the effect.

## Related smells

- [Side Effects](../07-functions/side-effects.md): the general smell of hidden side effects.
- [Command-Query Separation Violation](../07-functions/command-query-violation.md): a method that is both a query and a command.
- [Fallacious Method Name](fallacious-method-name.md): the name promises something else.
- [Ambiguous Name](ambiguous-name.md): the name does not tell everything that happens.
- [Side Effects in LINQ](../15-csharp/linq-side-effects.md): side effects inside LINQ queries.

## Automatic detection

- There are no general rules relating names to effects; it is caught in review or through tests.
- **C#**: `CA1024` suggests properties for side-effect-free `Get` methods (and by contrast invites reviewing those that do have effects); SonarQube warns about properties with complex logic.
- **Python / TS / Go**: custom rules or searches for `get*`/`is*` functions that call write methods (`save`, `insert`, `send`).

## Implementations

- Python: [`python/code_smells/names/names_hiding_side_effects/`](../../../python/code_smells/names/names_hiding_side_effects/)
- C#: [`csharp/src/CodeSmells/Names/NamesHidingSideEffects/`](../../../csharp/src/CodeSmells/Names/NamesHidingSideEffects/)
- React + TS: [`react-ts/src/smells/names/names-hiding-side-effects/`](../../../react-ts/src/smells/names/names-hiding-side-effects/)
- Go: [`go/smells/names/names-hiding-side-effects/`](../../../go/smells/names/names-hiding-side-effects/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
