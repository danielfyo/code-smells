# Lazy Class / Lazy Element

> **ID:** CS017 · **Category:** Dispensables · **Sources:** Fowler 1999/2018
>
> A class or function that does so little that it does not justify its existence.

## Definition

A **lazy class** is a class (or, in the terminology of Fowler's second edition, any **element**: class,
function, module) that does so little it is not worth the cost of its existence. Every abstraction has a
price (one more name to learn, one more jump when navigating, one more file) and must pay for it with
value.

They are usually leftovers from refactorings that emptied the class, or abstractions planned to grow
that never did.

## Symptoms

- Classes with one or two trivial methods that just wrap a call.
- Functions whose body is as clear as their name (`def get_total(o): return o.total`).
- Subclasses that add nothing to their base.
- Modules with a single one-line function.

## Common causes

- Refactorings that moved the functionality elsewhere.
- Up-front design of abstractions that ended up unused.
- Rigid rules like "one class per concept" applied without judgment.

## Why it is a problem

- Unnecessary indirection: the reader jumps from file to file without finding logic.
- More code surface to maintain and document.
- It dilutes the abstractions that do add value.

## Example (smelly)

```ts
// SMELL: a class that only wraps a trivial operation
export class PriceFormatter {
  format(amount: number): string {
    return amount.toFixed(2);
  }
}

const formatter = new PriceFormatter();
export const label = (p: Product) => `${p.name}: ${formatter.format(p.price)} €`;
```

## Solution (refactored)

```ts
export const label = (p: Product) => `${p.name}: ${p.price.toFixed(2)} €`;
```

The class provided neither a domain name nor an encapsulated decision; inlining it simplifies the code. If formatting grew (currency, locale), it would then deserve an abstraction.

## Recommended refactorings

- **Inline Class**: moves its content into the client or the class that uses it.
- **Inline Function**: removes functions whose body is as expressive as their name.
- **Collapse Hierarchy**: merges subclasses that add nothing into their base.

## When it may be acceptable

- Small value objects that give a name and a type to a concept (`Email`, `Money`): their value is type safety.
- Extension points or seams needed for testing or to isolate an external dependency.
- Classes that are part of a recognizable pattern (an adapter for an external SDK).

## Related smells

- [Speculative Generality](speculative-generality.md) — many lazy classes are born as speculative generality.
- [Middle Man](../05-couplers/middle-man.md) — a class that only delegates is a form of lazy class.
- [Data Class](data-class.md) — classes with data but no behavior.
- [Dead Code](dead-code.md) — a lazy class with no usages is dead code.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0903 too-few-public-methods` (a hint, with many false positives on dataclasses). |
| C# | `CA1812` (internal classes never instantiated); `CA1052` (types with only static members should be `static`). |
| React + TS | `@typescript-eslint/no-extraneous-class` (classes with only static members, or empty). |
| Go | No specific rule; `unused` detects unused types and functions. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/dispensables/lazy_class/`](../../../python/code_smells/dispensables/lazy_class/) |
| C# | [`csharp/src/CodeSmells/Dispensables/LazyClass/`](../../../csharp/src/CodeSmells/Dispensables/LazyClass/) |
| React + TS | [`react-ts/src/smells/dispensables/lazy-class/`](../../../react-ts/src/smells/dispensables/lazy-class/) |
| Go | [`go/smells/dispensables/lazy-class/`](../../../go/smells/dispensables/lazy-class/) |
| Angular | [`angular/src/smells/dispensables/lazy-class/`](../../../angular/src/smells/dispensables/lazy-class/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Refactoring.Guru — Lazy Class: https://refactoring.guru/smells/lazy-class
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
