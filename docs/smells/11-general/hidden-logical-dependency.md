# Logical Dependency Not Made Physical

> **ID:** CS073 · **Category:** General · **Sources:** Clean Code G22

*A module assumes something about another (a size, an order) without explicitly asking for it.*

## Definition

A module depends on another logically but not physically: it assumes a size, an order, a format or a value
that the other module defines, without explicitly asking for it. *Clean Code* (G22, *Make Logical
Dependencies Physical*) gives the example of a report generator that assumes its own `PAGE_SIZE = 55`
constant, when lines per page is the formatter's responsibility; the dependency should be expressed by asking
the formatter.

## Symptoms

- Duplicated constants that "must match" others in another module (`MAX_ITEMS = 50 # same as in the API`).
- Code that assumes a list arrives sorted or a field is never null because "the other service leaves it that way".
- Fixed indexes into another module's structures (`row[3]` is the price).
- Changes in one module that break another, apparently independent, one.

## Common causes

- Shortcuts to avoid widening the interface of the module depended on.
- Implicit knowledge shared by the team that is not reflected in the code.

## Why it is a problem

- **Silent breakage** when the depended-on module changes.
- **Invisible dependencies** for tools and readers alike.
- Hard-to-diagnose bugs because the symptom appears far from the cause.

## Example (smelly)

```csharp
public class InvoicePrinter
{
    // SMELL: must match PdfFormatter's page size, but nothing guarantees it
    private const int LinesPerPage = 40;

    public IEnumerable<Page> Paginate(Invoice invoice) =>
        invoice.Lines.Chunk(LinesPerPage).Select(chunk => new Page(chunk));
}
```

## Solution (refactored)

```csharp
public class InvoicePrinter
{
    private readonly IPageFormatter _formatter;

    public InvoicePrinter(IPageFormatter formatter) => _formatter = formatter;

    // REFACTOR: the logical dependency becomes physical by asking the owner
    public IEnumerable<Page> Paginate(Invoice invoice) =>
        invoice.Lines.Chunk(_formatter.LinesPerPage).Select(chunk => new Page(chunk));
}
```

## Recommended refactorings

- **Move Field** / **Move Function** so the data lives in a single place.
- **Replace Parameter with Query**, or ask the owning module instead of duplicating its knowledge.
- **Introduce Assertion** to make assumptions (ordering, non-null) explicit at the boundary.
- **Replace Primitive with Object** when depending on positions or formats.

## When it may be acceptable

- Stable, documented contracts between systems (a standard, a protocol), ideally verified with contract tests.

## Related smells

- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md): a hidden dependency on call order.
- [Duplicate Code](../04-dispensables/duplicate-code.md): duplicated constants and knowledge.
- [Magic Numbers / Magic Strings](../06-data/magic-numbers.md): assumed values are usually magic numbers.
- [Prefer Structure over Convention](convention-over-structure.md): relying on someone remembering to keep things consistent.
- [Be Precise / Imprecision](imprecision.md): assuming instead of verifying.

## Automatic detection

- **All languages**: duplicate detectors (SonarQube, `dupl` in golangci-lint, `jscpd`, Pylint `R0801` `duplicate-code`) find constants and blocks repeated across modules.
- **Contract tests** (e.g. Pact) for dependencies between services.
- **Change coupling analysis** on version history, as done by CodeScene, reveals modules that always change together without a physical dependency.

## Implementations

- Python: [`python/code_smells/general/hidden_logical_dependency/`](../../../python/code_smells/general/hidden_logical_dependency/)
- C#: [`csharp/src/CodeSmells/General/HiddenLogicalDependency/`](../../../csharp/src/CodeSmells/General/HiddenLogicalDependency/)
- React + TS: [`react-ts/src/smells/general/hidden-logical-dependency/`](../../../react-ts/src/smells/general/hidden-logical-dependency/)
- Go: [`go/smells/general/hidden-logical-dependency/`](../../../go/smells/general/hidden-logical-dependency/)

Each folder contains a `smelly` version (the smell, marked with `SMELL:` comments) and a `refactored` version (marked with `REFACTOR:` comments), plus tests showing that both have the same observable behavior.

## References

- Martin, R. C. (2008). *Clean Code*, ch. 17 "Smells and Heuristics". Prentice Hall.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Jerzyk, M. and Madeyski, L. (2023). "Code Smells: A Comprehensive Online Catalog and Taxonomy". Online catalog: https://codesmells.org
