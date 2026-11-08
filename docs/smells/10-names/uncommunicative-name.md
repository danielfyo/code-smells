# Mysterious / Uncommunicative Name

> **ID:** CS056 · **Category:** Names · **Sources:** Fowler 2018; Clean Code N1

*Names like d, tmp, data2 or proc that do not reveal intent.*

## Definition

An identifier (variable, function, class, module) whose name does not reveal its purpose: `d`, `tmp`,
`data2`, `proc`, `mgr`, `x1`. Fowler puts it first in the second edition of *Refactoring* (*Mysterious
Name*), and *Clean Code* (N1, *Choose Descriptive Names*) insists that names account for most of what makes
software readable. If a variable needs a comment to explain what it holds, the name has failed.

## Symptoms

- One- or two-letter names outside short loops (`d`, `r`, `cl`).
- Numeric suffixes to tell variables apart (`order1`, `order2`, `list2`).
- Empty generic words: `data`, `info`, `value`, `obj`, `item`, `manager`, `helper`.
- Private abbreviations (`calcTtlAmtWVat`) that only the author understands.
- Comments next to the declaration explaining what the variable is.

## Common causes

- Haste: thinking of a good name feels like a waste of time.
- The meaning was unclear when the code was written (poor understanding of the domain).
- Habits from languages with identifier length limits.

## Why it is a problem

- **Reading cost**: every reader has to rebuild the meaning in their head.
- **Errors** from confusing similar variables (`d` for days or for discount).
- The concept cannot be searched for (`grep data` is useless).

## Example (smelly)

```python
def calc(d, l):
    # SMELL: what are d, l, t and x?
    t = 0
    for x in l:
        if x[2] > d:
            t += x[1] * x[3]
    return t
```

## Solution (refactored)

```python
def revenue_since(start_date: date, sales: list[Sale]) -> Decimal:
    # REFACTOR: Rename Variable / Change Function Declaration
    revenue = Decimal("0")
    for sale in sales:
        if sale.sold_on > start_date:
            revenue += sale.unit_price * sale.quantity
    return revenue
```

## Recommended refactorings

- **Rename Variable** and **Rename Field**.
- **Change Function Declaration** to rename functions and parameters.
- **Replace Primitive with Object** (or a record with named fields) when values are accessed by index (`x[2]`).
- **Extract Variable** to name subexpressions.

## When it may be acceptable

- Indexes of very short loops (`i`, `j`) and well-known mathematical conventions (`x`, `y` in geometry).
- Single-use variables in short lambdas (`orders.map(o => o.total)`).
- Idiomatic language conventions: `err`, `ctx`, `w`, `r` in Go; `_` for discarded values.

## Related smells

- [Short Names for Long Scopes](short-names-long-scopes.md): a short name is a bigger problem the longer it lives.
- [Ambiguous Name](ambiguous-name.md): the name exists but can be read several ways.
- [Encodings in Names / Type Embedded in Name](encodings-in-names.md): the name describes the type instead of the purpose.
- [Redundant Comment](../09-comments/redundant-comment.md): comments that compensate for a bad name.
- [Primitive Obsession](../01-bloaters/primitive-obsession.md): tuples and lists accessed by position.

## Automatic detection

- **Python**: Pylint `C0103` (`invalid-name`) and `C0104` (`disallowed-name`, configurable list such as `foo`, `tmp`, `data`); Ruff `N8xx` (pep8-naming) and `E741` (ambiguous names `l`, `O`, `I`).
- **C#**: `IDE1006` (`.editorconfig` naming rules), `CA1707`, `CA1715`, `CA1720`; SonarQube naming rules (`S100`, `S101`, `S117`).
- **TypeScript**: ESLint `id-length`, `id-denylist`, `camelcase` and `@typescript-eslint/naming-convention`.
- **Go**: `revive` (`var-naming`, `receiver-naming`), `stylecheck`/staticcheck `ST1003` and `varnamelen` in golangci-lint.

Tools detect lengths and deny lists; whether a name communicates well is something only a person can decide.

## Implementations

- Python: [`python/code_smells/names/uncommunicative_name/`](../../../python/code_smells/names/uncommunicative_name/)
- C#: [`csharp/src/CodeSmells/Names/UncommunicativeName/`](../../../csharp/src/CodeSmells/Names/UncommunicativeName/)
- React + TS: [`react-ts/src/smells/names/uncommunicative-name/`](../../../react-ts/src/smells/names/uncommunicative-name/)
- Go: [`go/smells/names/uncommunicative-name/`](../../../go/smells/names/uncommunicative-name/)
- Angular: [`angular/src/smells/names/uncommunicative-name/`](../../../angular/src/smells/names/uncommunicative-name/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Martin, R. C. (2008). *Clean Code*, ch. 2 "Meaningful Names". Prentice Hall.
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
- Refactoring.Guru, *Code Smells*: https://refactoring.guru/refactoring/smells
