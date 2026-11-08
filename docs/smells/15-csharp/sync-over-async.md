# Sync over Async (.Result / .Wait())

> **ID:** CS114 · **Category:** C#/.NET-specific · **Sources:** D. Fowler AsyncGuidance

## Definition

Synchronous code blocks the current thread waiting for an asynchronous operation to complete through `.Result`,
`.Wait()`, `.GetAwaiter().GetResult()` or `Task.WaitAll`. In environments with a synchronization context it causes
**deadlocks**; on servers it **starves the thread pool**, because each request holds a thread that does nothing.

## Symptoms

- `var order = repository.GetAsync(id).Result;` or `SendAsync(...).Wait();`.
- Desktop applications that freeze forever when a button is clicked.
- ASP.NET APIs whose latency and thread count climb under load while CPU stays idle.
- `AggregateException` wrapping the real exception.
- Constructors, properties or `Dispose` methods calling asynchronous methods.

## Common causes

- Calling an async-only API from legacy synchronous code (interfaces, constructors, old-style `Main`).
- Avoiding propagating `async` through the whole call chain.
- Not understanding the role of `SynchronizationContext`.

## Why it is a problem

- **Deadlocks** in UI apps (WinForms, WPF, MAUI) and in classic ASP.NET (.NET Framework).
- **Thread-pool starvation** in ASP.NET Core: blocked threads cannot serve other requests and the pool grows slowly
  (it injects threads gradually), producing huge latencies.
- **Worse error handling**: `.Result` and `.Wait()` wrap the exception in `AggregateException`.
- All the benefits of asynchrony are lost while its cost is still paid.

## How it works under the hood

On `await`, if the task has not completed, the method suspends and registers a continuation. By default `await`
**captures the current `SynchronizationContext`** (the UI thread, or classic ASP.NET's request context, which only
allows one thread at a time) and the continuation is posted to it. If the thread that owns that context is blocked
in `.Result` waiting for the task, the continuation can never run and the task never completes: **deadlock**.
ASP.NET Core has no `SynchronizationContext`, so it does not deadlock this way, but the pool thread stays occupied
doing nothing; with enough concurrent requests, the pool runs out of threads to execute the very continuations that
would release the blocked ones. `ConfigureAwait(false)` in libraries avoids capturing the context, but does not fix
the thread blocking.

## Example (smelly)

```csharp
public class InvoiceController(IInvoiceService invoices) : ControllerBase
{
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        // SMELL: blocks a pool thread while waiting for I/O
        Invoice invoice = invoices.GetAsync(id).Result;
        invoices.MarkViewedAsync(id).Wait();
        return Ok(invoice);
    }
}

// In WPF: string text = client.GetStringAsync(url).Result; // deadlock on the UI thread
```

## Solution (refactored)

```csharp
public class InvoiceController(IInvoiceService invoices) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        // REFACTOR: async end to end; the thread returns to the pool during I/O
        Invoice invoice = await invoices.GetAsync(id, ct);
        await invoices.MarkViewedAsync(id, ct);
        return Ok(invoice);
    }
}
```

## Recommended refactorings

- **Async all the way**: make the call chain asynchronous up to the entry point (`async Task Main`, controller
  actions, handlers).
- **Move asynchronous initialization out of constructors** (`CreateAsync` factory methods,
  `IHostedService.StartAsync`).
- Implement **`IAsyncDisposable`** instead of blocking in `Dispose`.
- In libraries, **`ConfigureAwait(false)`** to reduce the risk when a client does block.
- If an API only has a synchronous version, call that rather than wrapping and blocking.

## When it may be acceptable

- Entry points without async support in old versions, although `async Task Main` has existed since C# 7.1.
- After `await Task.WhenAll(...)`, reading `.Result` from **already completed** tasks does not block.
- Console tools with no synchronization context and no concurrency, aware of the cost (preferably with
  `.GetAwaiter().GetResult()` to avoid `AggregateException`).

## Related smells

- [async void Methods](async-void.md)
- [Fake Async (Task.Run wrapping)](fake-async.md)
- [new HttpClient per Request](httpclient-per-request.md)
- [Missing Context Propagation (Go)](../17-go/missing-context.md)

## Automatic detection

- **Microsoft.VisualStudio.Threading.Analyzers**: `VSTHRD002` (Avoid problematic synchronous waits), `VSTHRD103`
  (Call async methods when in an async method) and `VSTHRD104` (Offer async option).
- **.NET analyzers**: `CA1849` (Call async methods when in an async method) and `CA2007` (Consider calling
  ConfigureAwait on the awaited task) for libraries.
- **xUnit analyzers**: `xUnit1031` (Do not use blocking task operations in test method).
- In production: `dotnet-counters` (`ThreadPool Thread Count`, `ThreadPool Queue Length`) reveals starvation.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/SyncOverAsync/`](../../../csharp/src/CodeSmells/CsharpSpecific/SyncOverAsync/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- David Fowler, *AsyncGuidance* ("Avoid using Task.Result and Task.Wait"):
  https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md
- Stephen Cleary, *Don't Block on Async Code*: https://blog.stephencleary.com/2012/07/dont-block-on-async-code.html
- Microsoft Learn, CA1849: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1849
- Microsoft Learn, *ASP.NET Core Best Practices* ("Avoid blocking calls"):
  https://learn.microsoft.com/aspnet/core/fundamentals/best-practices
- vs-threading analyzers: https://github.com/microsoft/vs-threading/blob/main/doc/analyzers/index.md
