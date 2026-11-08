# Inappropriate Intimacy

> **ID:** CS024 · **Category:** Couplers · **Sources:** Fowler 1999
>
> A class accesses the internal details (private fields, state) of another.

## Definition

**Inappropriate intimacy** occurs when a class knows and manipulates another class's internals: it
accesses private or protected fields, depends on its internal representation or modifies its state
without going through its interface. Sometimes it is two-way: two classes that "spend too much time
together" and poke into each other's insides.

In the second edition of *Refactoring*, Fowler folds it into *Insider Trading*; here it is kept separate
to emphasize the breach of encapsulation at the class level.

## Symptoms

- Access to `_`-prefixed members (Python), reflection or `InternalsVisibleTo` to bypass visibility.
- A class directly modifies another class's internal collections (`cart.items.append(...)`).
- Two-way references between two classes with cross calls.
- Changing the internal structure of one class breaks another that should not know about it.

## Common causes

- Shortcuts to "quickly reach" the data without designing a proper method.
- Responsibilities poorly divided between two closely related classes.
- Exposing mutable collections or internal state through getters.

## Why it is a problem

- The class's invariants can be broken from outside.
- The internal representation cannot be changed safely.
- Tight coupling that prevents reusing or testing the classes separately.

## Example (smelly)

```ts
class Cart {
  items: { sku: string; qty: number }[] = [];
  total = 0;
}

class CartController {
  add(cart: Cart, sku: string, price: number) {
    // SMELL: manipulates internal state and its invariants from outside
    cart.items.push({ sku, qty: 1 });
    cart.total += price;
  }
}
```

## Solution (refactored)

```ts
class Cart {
  readonly #items: { sku: string; qty: number; price: number }[] = [];

  add(sku: string, price: number): void {
    this.#items.push({ sku, qty: 1, price });
  }

  get total(): number {
    return this.#items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}

class CartController {
  add(cart: Cart, sku: string, price: number) { cart.add(sku, price); }
}
```

## Recommended refactorings

- **Move Function**: and **Move Field**: reduce what each class needs to know about the other.
- **Encapsulate Collection**: avoids exposing mutable internal collections.
- **Hide Delegate**: turns direct access into a message.
- **Replace Subclass with Delegate**: when the intimacy is between a subclass and its base.
- **Extract Class**: if two classes share so much that the common part deserves its own class.

## When it may be acceptable

- Nested or private helper classes designed to work together (a deliberate "friend").
- Tests that occasionally access internals to verify hard-to-observe state (better avoided).

## Related smells

- [Insider Trading](insider-trading.md) — Fowler's 2018 version at the module level.
- [Feature Envy](feature-envy.md) — envy leads to intimacy.
- [Message Chains (Train Wreck)](message-chains.md) — navigating the internal structure of other objects.
- [Exposing Mutable Collections](../15-csharp/exposed-mutable-collections.md) — C# variant.
- [Direct State Mutation](../16-react-ts/direct-state-mutation.md) — React variant: mutating state instead of replacing it.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0212 protected-access`; Ruff `SLF001` (private member access). |
| C# | `CA1051` (visible fields), `CA2227` (collections with setters), `CA1002` (do not expose `List<T>`); SonarQube `S2386` (public mutable static fields). |
| React + TS | `@typescript-eslint/explicit-member-accessibility`, `@typescript-eslint/prefer-readonly`; `#` or `private` fields and `ReadonlyArray` types. |
| Go | Capitalization-based visibility protects across packages; within the same package there is no protection. Review structs that expose internal slices or maps. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/couplers/inappropriate_intimacy/`](../../../python/code_smells/couplers/inappropriate_intimacy/) |
| C# | [`csharp/src/CodeSmells/Couplers/InappropriateIntimacy/`](../../../csharp/src/CodeSmells/Couplers/InappropriateIntimacy/) |
| React + TS | [`react-ts/src/smells/couplers/inappropriate-intimacy/`](../../../react-ts/src/smells/couplers/inappropriate-intimacy/) |
| Go | [`go/smells/couplers/inappropriate-intimacy/`](../../../go/smells/couplers/inappropriate-intimacy/) |
| Angular | [`angular/src/smells/couplers/inappropriate-intimacy/`](../../../angular/src/smells/couplers/inappropriate-intimacy/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Inappropriate Intimacy: https://refactoring.guru/smells/inappropriate-intimacy
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
