# Multiple Enumeration of IEnumerable

> **ID:** CS119 · **Category:** C#/.NET-specific · **Sources:** CA1851; ReSharper

## Definition

An `IEnumerable<T>` with **deferred execution** (a LINQ query, a `yield return` method, an Entity Framework
`IQueryable`, a file read) is enumerated several times: `Any()`, then `Count()`, then a `foreach`. Each enumeration
re-runs the whole query, repeating work, database queries or side effects, and possibly returning different results
each time.

## Symptoms

- An `IEnumerable<Order> orders` parameter on which `Any()`, `Count()` and `foreach` are all called.
- Several identical SQL queries in the EF Core logs for a single operation.
- `yield return` methods whose effects (logs, calls) appear duplicated.
- Totals that do not match the item count because the source changed between enumerations.

## Common causes

- Treating `IEnumerable<T>` as if it were a materialized collection.
- Chaining LINQ operators and reusing the query variable.
- Signatures accepting `IEnumerable<T>` "for flexibility" without documenting whether it is enumerated once or more.

## Why it is a problem

- **Performance**: repeated queries to the database, network or disk.
- **Inconsistent results**: the second enumeration may see different data.
- **Duplicated side effects** if the sequence produces them while iterating.
- **Failures** with sequences that can only be enumerated once (network readers, streaming `IAsyncEnumerable`).

## How it works under the hood

`IEnumerable<T>` promises a single method: `GetEnumerator()`. LINQ operators such as `Where` or `Select` compute
nothing when called: they return an object that **describes** the query. Every time something calls
`GetEnumerator()` (a `foreach`, `Count()`, `Any()`, `First()`, `ToList()`), the whole chain runs from the source.
`yield return` methods compile into a state machine that restarts on each enumeration. With `IQueryable<T>`
(EF Core), each enumeration translates the expression to SQL and sends a new query. Some operators have shortcuts
(`Count()` on an `ICollection<T>`), but you cannot rely on them when the actual type is a deferred query.

## Example (smelly)

```csharp
public InvoiceSummary Summarize(IEnumerable<Invoice> invoices)
{
    var overdue = invoices.Where(i => i.DueDate < DateTime.Today && !i.Paid);

    if (!overdue.Any())                        // SMELL: 1st execution
        return InvoiceSummary.Empty;

    int count = overdue.Count();               // SMELL: 2nd execution
    decimal total = overdue.Sum(i => i.Amount); // SMELL: 3rd execution
    return new InvoiceSummary(count, total);
}
```

## Solution (refactored)

```csharp
public InvoiceSummary Summarize(IEnumerable<Invoice> invoices, DateTime today)
{
    // REFACTOR: materialize once and work on the collection
    List<Invoice> overdue = invoices
        .Where(i => i.DueDate < today && !i.Paid)
        .ToList();

    if (overdue.Count == 0)
        return InvoiceSummary.Empty;

    return new InvoiceSummary(overdue.Count, overdue.Sum(i => i.Amount));
}
```

Alternative: accept `IReadOnlyCollection<Invoice>` or `IReadOnlyList<Invoice>` in the signature, so the caller hands
over an already materialized collection.

## Recommended refactorings

- **Materialize with `ToList()` / `ToArray()`** once when several passes are needed.
- **Change the signature** to `IReadOnlyCollection<T>` / `IReadOnlyList<T>` if the method needs to count or iterate
  more than once.
- **Compute everything in one pass** (`Aggregate`, a single `foreach` accumulating several values).
- In EF Core, **project in the query** (`Select` + `CountAsync`/`SumAsync`) so the database does the work.

## When it may be acceptable

- The source is already an in-memory collection (`List<T>`, array) and the declared type guarantees it.
- You **intentionally** want to re-evaluate the query to see fresh data (for example, polling).
- Infinite or huge sequences that cannot be materialized; then design for a single pass.

## Related smells

- [Side Effects in LINQ](linq-side-effects.md)
- [Hidden Temporal Coupling](../05-couplers/hidden-temporal-coupling.md)
- [DateTime.Now Hidden Dependency](datetime-now-dependency.md): the smelly example suffers from it too.
- [Loops / Imperative Loops](../06-data/loops.md)

## Automatic detection

- **.NET analyzers**: `CA1851` (Possible multiple enumerations of `IEnumerable` collection), available since .NET 7
  and disabled by default.
- **ReSharper / Rider**: "Possible multiple enumeration" inspection.
- **EF Core**: SQL command logging (`LogTo`, `EnableSensitiveDataLogging` in development) reveals repeated queries.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/MultipleEnumeration/`](../../../csharp/src/CodeSmells/CsharpSpecific/MultipleEnumeration/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, CA1851: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1851
- Microsoft Learn, *Deferred execution and lazy evaluation*:
  https://learn.microsoft.com/dotnet/standard/linq/deferred-execution-lazy-evaluation
- Microsoft Learn, *Iterators* (`yield return`): https://learn.microsoft.com/dotnet/csharp/iterators
