# Missing using / IDisposable Leak

> **ID:** CS115 · **Category:** C#/.NET-specific · **Sources:** CA2000

## Definition

Objects implementing `IDisposable` or `IAsyncDisposable` (connections, commands, streams, readers, sockets,
`CancellationTokenSource`, timers) are created and not released deterministically with `using` or `Dispose()`. The
underlying unmanaged resource (file handle, network connection, pooled connection) is held until the garbage
collector — if it ever gets there — runs a finalizer.

## Symptoms

- `var conn = new SqlConnection(...)` without `using`, or with `Close()` at the end but no `try/finally`.
- "Timeout expired. The timeout period elapsed prior to obtaining a connection from the pool" errors.
- `IOException: The process cannot access the file because it is being used by another process`.
- Classes that hold an `IDisposable` field but do not implement `IDisposable`.
- Memory or handle usage that grows over time.

## Common causes

- Believing the garbage collector releases every resource in time.
- Exception paths or early returns that skip the manual `Dispose()`.
- Not knowing which types are disposable or who owns an object.

## Why it is a problem

- **Resource exhaustion**: pooled connections, file handles, sockets.
- **File locks** that prevent other processes (or the same one) from accessing files.
- **Unflushed data**: an undisposed `StreamWriter` may lose its buffered content.
- **GC pressure**: objects with finalizers survive an extra collection.

## How it works under the hood

The .NET GC only manages **managed memory**; it does not know when to close a connection or an OS handle.
`IDisposable.Dispose()` is the contract for releasing such resources deterministically. The `using (var x = ...) { }`
statement or the `using var x = ...;` declaration (C# 8) compiles into a `try/finally` that calls `Dispose()` when
leaving the scope, even when exceptions occur; `await using` does the same with `IAsyncDisposable.DisposeAsync()`.
Types that wrap unmanaged resources usually have a finalizer (via `SafeHandle`) as a safety net, but finalizers run
at an indeterminate time, on another thread, and only after the GC has found the object unreachable.

## Example (smelly)

```csharp
public int CountPendingOrders(string connectionString)
{
    var connection = new SqlConnection(connectionString);   // SMELL: no using
    connection.Open();
    var command = new SqlCommand(
        "SELECT COUNT(*) FROM Orders WHERE Status = 'Pending'", connection);
    int count = (int)command.ExecuteScalar();  // if it throws, the connection never returns to the pool
    connection.Close();
    return count;
}
```

## Solution (refactored)

```csharp
public async Task<int> CountPendingOrdersAsync(string connectionString, CancellationToken ct)
{
    // REFACTOR: await using guarantees release even when exceptions occur
    await using var connection = new SqlConnection(connectionString);
    await connection.OpenAsync(ct);
    await using var command = new SqlCommand(
        "SELECT COUNT(*) FROM Orders WHERE Status = 'Pending'", connection);
    return (int)(await command.ExecuteScalarAsync(ct))!;
}
```

## Recommended refactorings

- **Wrap in `using` / `await using`** every disposable object created and owned locally.
- **Implement `IDisposable`** (or `IAsyncDisposable`) in classes that own disposable fields, following the Dispose
  pattern; making the class `sealed` simplifies the implementation.
- **Delegate ownership to the DI container**: registered services are disposed when their scope ends.
- Make ownership explicit in the API (`leaveOpen`, `ownsStream` parameters...).

## When it may be acceptable

- Objects whose lifetime is managed by another component (the DI container, an `IHttpClientFactory`).
- A shared long-lived `HttpClient`, intentionally never disposed (see
  [new HttpClient per Request](httpclient-per-request.md)).
- Types that implement `IDisposable` without holding real resources (`MemoryStream`, `Task`), where not disposing
  is harmless, although disposing is still good practice.

## Related smells

- [Not Using Context Managers (Python)](../14-python/missing-context-manager.md)
- [defer in Loop (Go)](../17-go/defer-in-loop.md)
- [Missing Effect Cleanup (React + TS)](../16-react-ts/missing-effect-cleanup.md)
- [new HttpClient per Request](httpclient-per-request.md)

## Automatic detection

- **.NET analyzers**: `CA2000` (Dispose objects before losing scope), `CA2213` (Disposable fields should be
  disposed), `CA1001` (Types that own disposable fields should be disposable) and `CA1816` (Call GC.SuppressFinalize
  correctly).
- **IDE0063** suggests the simplified `using` declaration.
- Diagnostic tools (`dotnet-counters`, `dotnet-dump`) to detect leaks at runtime.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/MissingDispose/`](../../../csharp/src/CodeSmells/CsharpSpecific/MissingDispose/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, CA2000: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2000
- Microsoft Learn, *Implement a Dispose method*:
  https://learn.microsoft.com/dotnet/standard/garbage-collection/implementing-dispose
- Microsoft Learn, *using statement*: https://learn.microsoft.com/dotnet/csharp/language-reference/statements/using
- Microsoft Learn, *Implement a DisposeAsync method*:
  https://learn.microsoft.com/dotnet/standard/garbage-collection/implementing-disposeasync
