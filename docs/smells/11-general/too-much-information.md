# Too Much Information / Indecent Exposure

> **ID:** CS068 · **Category:** General · **Sources:** Clean Code G8; Kerievsky 2004

*Wide interfaces that expose internal details which should be private.*

## Definition

A module, class or package exposes much more than necessary: public fields, mutable internal collections,
helper methods used only by the class itself, constants and implementation details. *Clean Code* (G8, *Too
Much Information*) calls for small, narrow interfaces; Kerievsky (*Refactoring to Patterns*) calls classes
that make visible methods or classes their clients should not know about *Indecent Exposure*.

## Symptoms

- Public fields or properties with public setters for state that should be controlled.
- Methods returning the internal list, which clients modify directly.
- Classes with dozens of public methods of which each client uses two or three.
- Packages that export everything (no `__all__`, everything capitalized in Go, `export` on every TS function).

## Common causes

- Public visibility by default ("in case someone needs it").
- Tests that reach into internals instead of testing behavior.
- No explicit design of the module's interface.

## Why it is a problem

- **Coupling**: clients depend on details that then cannot be changed.
- **Broken invariants** because anyone can modify internal state.
- APIs that are hard to learn because of their size.

## Example (smelly)

```csharp
public class ShoppingCart
{
    // SMELL: internal state exposed and modifiable from outside
    public List<CartLine> Lines = new();
    public decimal CachedTotal;
    public void RecalculateTotalInternal() => CachedTotal = Lines.Sum(l => l.Subtotal);
}

// Some client:
cart.Lines.Add(line);           // forgets to recalculate the total
cart.CachedTotal = 0;           // breaks the invariant
```

## Solution (refactored)

```csharp
public class ShoppingCart
{
    private readonly List<CartLine> _lines = new();

    // REFACTOR: narrow interface; the collection is exposed read-only
    public IReadOnlyList<CartLine> Lines => _lines;
    public decimal Total => _lines.Sum(l => l.Subtotal);

    public void Add(CartLine line) => _lines.Add(line);
}
```

## Recommended refactorings

- **Encapsulate Variable** and **Encapsulate Collection**.
- **Remove Setting Method** when the value must not change after construction.
- **Hide Delegate** to avoid exposing internal objects.
- Reduce helper visibility to private or internal; in Kerievsky's terms, **Encapsulate Classes with Factory**.

## When it may be acceptable

- Data transfer objects (DTOs) or immutable records whose purpose is to expose their fields.
- Simple Go structs with exported fields that have no invariants to protect.

## Related smells

- [Data Class](../04-dispensables/data-class.md): classes that only expose data.
- [Inappropriate Intimacy](../05-couplers/inappropriate-intimacy.md): classes that know too much about each other.
- [Exposing Mutable Collections](../15-csharp/exposed-mutable-collections.md): C#-specific variant.
- [Insider Trading](../05-couplers/insider-trading.md): excessive data exchange between modules.
- [Global Data](../05-couplers/global-data.md): maximum exposure.

## Automatic detection

- **Python**: Pylint `W0212` (`protected-access`) and Ruff `SLF001` (private member access from outside); define `__all__` in modules.
- **C#**: `CA1051` (do not declare visible instance fields), `CA1002` (do not expose `List<T>`), `CA2227` (collection properties should be read-only), `CA1819` (properties should not return arrays).
- **TypeScript**: `@typescript-eslint/explicit-member-accessibility` and tools such as `ts-prune`/`knip` to detect unused exports.
- **Go**: `revive` (`exported`), staticcheck's `unused` for exported identifiers with no external use, `gochecknoglobals`.

## Implementations

- Python: [`python/code_smells/general/too_much_information/`](../../../python/code_smells/general/too_much_information/)
- C#: [`csharp/src/CodeSmells/General/TooMuchInformation/`](../../../csharp/src/CodeSmells/General/TooMuchInformation/)
- React + TS: [`react-ts/src/smells/general/too-much-information/`](../../../react-ts/src/smells/general/too-much-information/)
- Go: [`go/smells/general/too-much-information/`](../../../go/smells/general/too-much-information/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Kerievsky, J. (2004). *Refactoring to Patterns*. Addison-Wesley.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
