# Encodings in Names / Type Embedded in Name

> **ID:** CS061 · **Category:** Names · **Sources:** Clean Code N6; Jerzyk 2023

*Hungarian notation, m_ prefixes or embedded types (strName, unnecessary IUserInterface).*

## Definition

Names embed type or scope information through prefixes or suffixes: Hungarian notation (`strName`, `iCount`,
`bActive`), member prefixes (`m_total`), the type at the end (`priceFloat`, `customerList`, `userDict`) or
other needless prefixes. *Clean Code* (N6, *Avoid Encodings*) explains that modern environments and type
systems make these encodings redundant, and they lie when the type changes. Jerzyk and Madeyski list it as
*Type Embedded in Name*.

## Symptoms

- Type prefixes: `str`, `int`, `b`, `arr`, `obj`, `lst`.
- Scope prefixes: `m_`, `g_`, `s_`.
- Suffixes that repeat the type: `nameString`, `ordersArray`, `totalDecimal`.
- Names that no longer match their type (`customerList` that is now a `set`).

## Common causes

- Legacy conventions from 1990s C/C++ or Visual Basic.
- Editors without type information, which is no longer the norm.
- Old corporate style guides that were never revised.

## Why it is a problem

- **Noise** that has to be filtered out mentally while reading.
- **Names that lie** when the type changes and nobody renames.
- Changes of representation become harder (from list to set, from `float` to `Decimal`).

## Example (smelly)

```csharp
public class OrderService
{
    private decimal m_decTotal;            // SMELL: scope prefix + type
    private List<Order> m_lstOrders = new();

    public void AddOrder(Order objOrder)
    {
        m_lstOrders.Add(objOrder);
        m_decTotal += objOrder.Amount;
    }
}
```

## Solution (refactored)

```csharp
public class OrderService
{
    // REFACTOR: the compiler states the type; the name states the purpose
    private decimal _total;
    private readonly List<Order> _orders = new();

    public void AddOrder(Order order)
    {
        _orders.Add(order);
        _total += order.Amount;
    }
}
```

A leading underscore for private fields (`_total`) is the convention recommended by the .NET style
guidelines and is not considered a problematic encoding. The same applies to the `I` prefix on C# interfaces.

## Recommended refactorings

- **Rename Variable / Rename Field**, removing type prefixes and suffixes.
- **Change Function Declaration** for parameters and methods.
- Update the team style guide and enforce the rule in the linter.

## When it may be acceptable

- Current language conventions: `I` for interfaces in C#, `_field` for private fields in C#, `_private` in Python.
- Suffixes that carry units or semantics rather than type: `timeoutMs`, `priceCents`, `rawHtml` versus `safeHtml` (Joel Spolsky's classic "Apps Hungarian" example).
- Ecosystem suffix conventions, such as `Props` for React types or `Async` for asynchronous .NET methods.

## Related smells

- [Names at Wrong Abstraction Level](wrong-abstraction-level-name.md): names that reveal the implementation.
- [Mysterious / Uncommunicative Name](uncommunicative-name.md): a prefix is no substitute for a meaningful name.
- [Non-Standard Nomenclature](non-standard-nomenclature.md): conventions foreign to the language.
- [Stuttering Names](../17-go/stuttering-names.md): redundant repetition in Go names.

## Automatic detection

- **C#**: `CA1720` (*Identifier contains type name*), `CA1707` (underscores in public identifiers) and `.editorconfig` naming rules (`IDE1006`).
- **Python**: Pylint `C0103` with regular expressions (`variable-rgx`, `attr-rgx`) that forbid prefixes like `str_` or `lst_`.
- **TypeScript**: `@typescript-eslint/naming-convention` can forbid prefixes (including `I` on interfaces, if the team decides so).
- **Go**: `revive` (`var-naming`) and staticcheck `ST1003` flag underscores and incorrect initialisms; the rest is manual review.

## Implementations

- Python: [`python/code_smells/names/encodings_in_names/`](../../../python/code_smells/names/encodings_in_names/)
- C#: [`csharp/src/CodeSmells/Names/EncodingsInNames/`](../../../csharp/src/CodeSmells/Names/EncodingsInNames/)
- React + TS: [`react-ts/src/smells/names/encodings-in-names/`](../../../react-ts/src/smells/names/encodings-in-names/)
- Go: [`go/smells/names/encodings-in-names/`](../../../go/smells/names/encodings-in-names/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
