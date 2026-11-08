# Locking on this / public objects

> **ID:** CS125 · **Category:** C#/.NET-specific · **Sources:** Microsoft Docs

## Definition

Something **reachable from outside** the class is used as the lock object: `lock (this)`, `lock (typeof(X))`,
`lock ("literal")` or a public collection. Any other code holding a reference to that object can lock on it too,
without knowing it, causing unexpected contention or deadlocks that the class cannot control.

## Symptoms

- `lock (this) { ... }` in instance methods.
- `lock (typeof(InventoryService))` in static methods.
- `lock ("inventory")` or `lock (SomePublicList)`.
- Hangs or waits that only appear when two independent components are combined.

## Common causes

- Old samples and early .NET documentation.
- Not bothering to create a dedicated lock field.
- Not realizing the *monitor* is tied to the object, not to the code block.

## Why it is a problem

- **Deadlocks** caused by external code locking the same object in a different order.
- **Unexpected contention**: foreign code serializes the class's operations.
- **Broken encapsulation**: the synchronization strategy is exposed.
- With `typeof` or strings, the object is shared by **the whole process** (string literals are interned), so
  unrelated components can block each other.

## How it works under the hood

`lock (obj) { ... }` compiles to `Monitor.Enter(obj, ref taken)` followed by a `try/finally` with
`Monitor.Exit(obj)`. The monitor is bound to the **object's identity** (its sync block), so two pieces of code that
lock the same reference exclude each other even if they live in different classes. `this` is reachable by anyone
holding the instance; `typeof(X)` returns a single `Type` object per process; string literals are interned and
shared. Since .NET 9 and C# 13 there is the `System.Threading.Lock` type: when `lock` receives a `Lock` instance,
the compiler uses its API (`EnterScope()`), which is more efficient and explicit than `Monitor`.

## Example (smelly)

```csharp
public class Inventory
{
    private readonly Dictionary<string, int> _stock = new();

    public void Reserve(string sku, int quantity)
    {
        lock (this)   // SMELL: anyone holding the instance can lock on it
        {
            if (_stock.GetValueOrDefault(sku) < quantity)
                throw new InvalidOperationException($"Out of stock: {sku}");
            _stock[sku] -= quantity;
        }
    }
}

// In another component:
// lock (inventory) { Thread.Sleep(5000); }  // blocks every reservation
```

## Solution (refactored)

```csharp
public class Inventory
{
    // REFACTOR: private, dedicated lock object (System.Threading.Lock on .NET 9+;
    // on earlier versions: private readonly object _gate = new();)
    private readonly Lock _gate = new();
    private readonly Dictionary<string, int> _stock = new();

    public void Reserve(string sku, int quantity)
    {
        lock (_gate)
        {
            if (_stock.GetValueOrDefault(sku) < quantity)
                throw new InvalidOperationException($"Out of stock: {sku}");
            _stock[sku] -= quantity;
        }
    }
}
```

## Recommended refactorings

- **Introduce a private `readonly` field** dedicated to locking (`Lock` on .NET 9+, `object` before).
- For static state, a **`private static readonly`** field instead of `typeof(...)`.
- Consider **concurrent collections** (`ConcurrentDictionary`) or `Interlocked` and avoid the lock altogether.
- In asynchronous code, use `SemaphoreSlim` (`await WaitAsync()`), since you cannot `await` inside a `lock`.

## When it may be acceptable

- Private or nested classes whose instances never leave their owner (a dedicated field is still clearer).
- APIs that explicitly document that clients must synchronize on a specific object (for example
  `ICollection.SyncRoot` in legacy collections).

## Related smells

- [Static Mutable State](static-mutable-state.md)
- [Copying sync.Mutex (Go)](../17-go/copying-mutex.md)
- [Concurrent Map Access without Sync (Go)](../17-go/unsynchronized-map.md)
- [Too Much Information / Indecent Exposure](../11-general/too-much-information.md)

## Automatic detection

- **.NET analyzers**: `CA2002` (Do not lock on objects with weak identity), covering `Type`, strings,
  `MarshalByRefObject`, `Thread` and other objects reachable across domains.
- **SonarAnalyzer for C#**: rule `S2551` (shared resources such as `this`, `Type` or strings should not be used for
  locking).
- **Code style**: `IDE0330` (Prefer `System.Threading.Lock`) suggests the dedicated lock type on .NET 9+.
- **Compiler (C# 13)**: warning `CS9216` when a `System.Threading.Lock` instance is converted to another type and
  locked, which silently falls back to `Monitor`.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/LockOnThis/`](../../../csharp/src/CodeSmells/CsharpSpecific/LockOnThis/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, *The lock statement* (guidelines on the lock object):
  https://learn.microsoft.com/dotnet/csharp/language-reference/statements/lock
- Microsoft Learn, CA2002: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2002
- Microsoft Learn, *Managed threading best practices*:
  https://learn.microsoft.com/dotnet/standard/threading/managed-threading-best-practices
- Microsoft Learn, `System.Threading.Lock`: https://learn.microsoft.com/dotnet/api/system.threading.lock
