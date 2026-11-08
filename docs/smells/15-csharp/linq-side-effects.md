# Side Effects in LINQ

> **ID:** CS128 · **Category:** C#/.NET-specific · **Sources:** Microsoft Docs

## Definition

Lambdas passed to LINQ operators (`Select`, `Where`, `OrderBy`, `Any`...) modify external state: they increment
counters, add to lists, send emails, write to a database or mutate the elements they iterate. LINQ queries are meant
to be declarative and side-effect free; because of **deferred execution**, those effects run zero, one or many times,
at moments the reader does not expect.

## Symptoms

- `orders.Select(o => { o.Status = "Sent"; _email.Send(o); return o; })`.
- `.Where(x => { counter++; return x.Active; })`.
- A query whose result is never enumerated, so "nothing happens".
- Effects that run twice because the query is enumerated twice (`Count()` and then `foreach`).
- `.ToList().ForEach(...)` used purely to run commands.

## Common causes

- Using LINQ as a general-purpose loop syntax.
- Wanting to "do it all in one line".
- Not understanding deferred execution.

## Why it is a problem

- **Unpredictable execution**: effects depend on whether, when and how many times the query is enumerated.
- **Short-circuiting operators** (`Any`, `First`, `Take`) stop early, so effects only apply to part of the data.
- **Parallelization breaks it**: with `AsParallel()` the effects race with each other.
- **Command-query separation is violated**: something that looks like a query changes the system.

## How it works under the hood

LINQ to Objects operators are implemented as iterators: `Select` and `Where` return an object that, when enumerated,
pulls items one at a time from the source and invokes the lambda. Nothing runs until something calls
`GetEnumerator()` (`foreach`, `ToList()`, `Count()`, `First()`), and every enumeration runs the lambdas again. Items
flow through the whole pipeline one by one (`Where` → `Select` → consumer), so the relative order of effects across
operators is interleaved, not stage by stage. Operators like `Any` or `First` stop pulling as soon as they have an
answer. With `IQueryable` (EF Core), lambdas are translated into SQL instead of executed, so side effects either
cannot be translated (runtime exception) or are evaluated client-side in surprising ways.

## Example (smelly)

```csharp
public int ShipPaidOrders(IEnumerable<Order> orders)
{
    int shipped = 0;
    var result = orders
        .Where(o => o.IsPaid)
        .Select(o =>
        {
            o.Status = OrderStatus.Shipped;   // SMELL: mutation inside a query
            _notifier.SendShippedEmail(o);    // SMELL: I/O inside a query
            shipped++;
            return o;
        });

    _logger.LogInformation("Shipping {Count} orders", result.Count()); // runs the effects
    _repository.SaveAll(result);                                         // ...and runs them again
    return shipped;                                                      // twice the real number
}
```

## Solution (refactored)

```csharp
public int ShipPaidOrders(IEnumerable<Order> orders)
{
    // REFACTOR: pure query, materialized once...
    List<Order> toShip = orders.Where(o => o.IsPaid).ToList();

    // ...and the commands in an explicit loop
    foreach (var order in toShip)
    {
        order.MarkAsShipped();
        _notifier.SendShippedEmail(order);
    }

    _repository.SaveAll(toShip);
    _logger.LogInformation("Shipped {Count} orders", toShip.Count);
    return toShip.Count;
}
```

## Recommended refactorings

- **Separate Query from Modifier**: the query selects; a `foreach` executes the commands.
- **Materialize once** (`ToList()`) before applying effects or enumerating several times.
- **Return new objects** in `Select` (projections, `with` expressions on records) instead of mutating the source.
- **Move the mutation into the entity** (`order.MarkAsShipped()`) so it is explicit and testable.

## When it may be acceptable

- Harmless, idempotent effects such as debugging output or tracing during development.
- Caching inside a projection whose result is materialized immediately (`.Select(Compute).ToList()`), when the
  "effect" is invisible to callers.

## Related smells

- [Side Effects](../07-functions/side-effects.md)
- [Command-Query Separation Violation](../07-functions/command-query-violation.md)
- [Multiple Enumeration of IEnumerable](multiple-enumeration.md)
- [Mutable Data](../06-data/mutable-data.md)

## Automatic detection

There is no standard .NET analyzer rule for side effects in LINQ lambdas. `CA1851` (multiple enumeration) catches the
most damaging combination, and ReSharper / Rider flag "possible multiple enumeration" and some impure lambdas.
Otherwise, it is found in code review by looking for statement lambdas (`=> { ... }`) or assignments inside `Select`
and `Where`.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/LinqSideEffects/`](../../../csharp/src/CodeSmells/CsharpSpecific/LinqSideEffects/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, *Deferred execution and lazy evaluation*:
  https://learn.microsoft.com/dotnet/standard/linq/deferred-execution-lazy-evaluation
- Microsoft Learn, *Refactor into pure functions* (LINQ to XML series; notes that standard query operators are
  pure functions):
  https://learn.microsoft.com/dotnet/standard/linq/refactor-pure-functions
- Microsoft Learn, *Language Integrated Query (LINQ)*: https://learn.microsoft.com/dotnet/csharp/linq/
