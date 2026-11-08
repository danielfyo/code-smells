# Static Mutable State

> **ID:** CS123 · **Category:** C#/.NET-specific · **Sources:** Microsoft Docs

## Definition

A class keeps modifiable `static` fields or properties (counters, caches, lists, the "current user", configuration)
that are shared by every thread, request and test in the process. In concurrent applications, such as any ASP.NET
Core service, that state becomes a source of race conditions, data leaking between users, and tests that interfere
with each other.

## Symptoms

- `public static List<Order> PendingOrders = new();` or `private static int _nextId;` modified in methods.
- A `static User CurrentUser` assigned at the start of each request.
- `static Dictionary<,>` caches without synchronization.
- Tests that pass alone and fail in parallel or depending on order.
- Intermittent errors such as `InvalidOperationException: Collection was modified`, or one customer's data showing
  up in another customer's response.

## Common causes

- Convenience: the data is available anywhere without passing it around.
- Hand-rolled singletons or caches.
- Code designed for a single-user desktop app reused on a server.

## Why it is a problem

- **Race conditions**: `_nextId++` is not atomic; `Dictionary` and `List` are not safe for concurrent writes and can
  become corrupted.
- **Leaks between requests**: a `static CurrentUser` mixes the identities of concurrent users.
- **Coupled tests**: the state survives from one test to the next within the same process.
- **Memory leaks**: static collections live as long as the application (they are GC roots).
- **Hidden dependencies** that never appear in a constructor.

## How it works under the hood

A `static` field belongs to the type, not to an instance: there is a single copy per AppDomain (in .NET Core, per
process; more precisely, per `AssemblyLoadContext`), initialized the first time the type is used and alive until
the process ends. Static fields are garbage-collector roots, so whatever they reference is never collected.
Operations such as `x++` are multi-instruction read-modify-write sequences, not atomic. `[ThreadStatic]` gives one
copy per thread, but in `async` code the continuation may run on a different thread; `AsyncLocal<T>` flows with the
execution context. In ASP.NET Core, per-request state belongs in *scoped* services or `HttpContext`, and shared
state in thread-safe singletons.

## Example (smelly)

```csharp
public static class OrderNumbering
{
    private static int _next = 1;                          // SMELL: shared by the whole process
    public static List<string> Issued { get; } = new();    // SMELL: grows forever, not thread-safe

    public static string NextNumber()
    {
        var number = $"ORD-{_next++:D6}";   // two concurrent requests may get the same number
        Issued.Add(number);
        return number;
    }
}
```

## Solution (refactored)

```csharp
public interface IOrderNumberGenerator
{
    string NextNumber();
}

// REFACTOR: state encapsulated in a thread-safe, injectable singleton service
public sealed class OrderNumberGenerator(int start = 1) : IOrderNumberGenerator
{
    private int _next = start - 1;

    public string NextNumber() => $"ORD-{Interlocked.Increment(ref _next):D6}";
}

// Program.cs: builder.Services.AddSingleton<IOrderNumberGenerator, OrderNumberGenerator>();
// Tests: new OrderNumberGenerator(start: 100) — each test gets its own instance
```

In a real system, numbering belongs in the database (sequences) so it survives restarts and works across instances.

## Recommended refactorings

- **Move the state into a service** registered in DI with the right lifetime (singleton, scoped).
- **Use thread-safe primitives** (`Interlocked`, `ConcurrentDictionary`, `lock`) for unavoidable shared state.
- **Per-request state** in *scoped* services or `HttpContext.Items`, never in `static`.
- **Caches** via `IMemoryCache` / `HybridCache`, which handle expiration and memory limits.
- **Make the state immutable** (`static readonly` with immutable types, `FrozenDictionary`).

## When it may be acceptable

- **Immutable** constants and data (`static readonly` immutable types, frozen lookup tables).
- Thread-safe objects with no per-user state, such as a shared `HttpClient` or a `JsonSerializerOptions` configured
  once.
- Low-level internal caches, carefully synchronized and bounded.

## Related smells

- [Global Data](../05-couplers/global-data.md)
- [global Statement (Python)](../14-python/global-statement.md)
- [Mutable Package-level State (Go)](../17-go/package-level-state.md)
- [Inappropriate Static](../02-oo-abusers/inappropriate-static.md)
- [Locking on this / public objects](lock-on-this.md)
- [Interdependent Tests / Shared Fixture](../12-tests/interdependent-tests.md)

## Automatic detection

- **.NET analyzers**: `CA2211` (Non-constant fields should not be visible) for mutable public static fields, and
  `CA1802` (Use literals where appropriate).
- **SonarAnalyzer for C#**: rule `S2696` (instance members should not write to static fields).
- **IDE0044** (Add readonly modifier) flags fields that could be `readonly`.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/StaticMutableState/`](../../../csharp/src/CodeSmells/CsharpSpecific/StaticMutableState/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, CA2211: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2211
- Microsoft Learn, *Managed threading best practices*:
  https://learn.microsoft.com/dotnet/standard/threading/managed-threading-best-practices
- Microsoft Learn, *Dependency injection — Service lifetimes*:
  https://learn.microsoft.com/dotnet/core/extensions/dependency-injection#service-lifetimes
- Microsoft Learn, *Thread-safe collections*: https://learn.microsoft.com/dotnet/standard/collections/thread-safe/
