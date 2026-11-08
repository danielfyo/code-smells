# Fake Async (Task.Run wrapping)

> **ID:** CS129 · **Category:** C#/.NET-specific · **Sources:** S. Cleary

## Definition

A library or service exposes an `...Async` method whose implementation is just synchronous (often blocking I/O or
CPU-bound) code wrapped in `Task.Run`. The method *looks* asynchronous but is not: it does not free any thread, it
merely moves the blocking work to another thread-pool thread, adding overhead and misleading the caller.

## Symptoms

- `public Task<Report> GenerateAsync() => Task.Run(() => Generate());` in a library or domain service.
- `Task.Run(() => File.ReadAllText(path))` when `File.ReadAllTextAsync` exists.
- `async` methods whose only `await` is `await Task.Run(...)` around blocking calls.
- ASP.NET Core endpoints that use `Task.Run` "to be asynchronous".
- Pairs of `Foo()` / `FooAsync()` where the async one simply calls the sync one on the pool.

## Common causes

- Wanting to offer an asynchronous API because "everything should be async".
- Making a blocking call "non-blocking" without an asynchronous I/O API available.
- Confusing asynchrony (not occupying a thread while waiting) with parallelism (using more threads).

## Why it is a problem

- **No scalability gain on servers**: one request thread is released and another is occupied; with additional
  context switches, throughput gets worse, not better.
- **Misleading contract**: callers assume real async I/O and may launch many concurrent calls, saturating the pool.
- **Takes the decision away from the caller**: only the application knows whether offloading to the pool makes sense
  (for example, keeping a UI thread responsive).
- **Loses cancellation and context**: the wrapped synchronous code usually ignores `CancellationToken`.

## How it works under the hood

Truly asynchronous I/O in .NET (sockets, `FileStream` with async options, database drivers) registers the operation
with the OS (IOCP on Windows, epoll/kqueue on Unix) and returns an incomplete `Task`; **no thread is blocked** while
waiting, and the continuation runs when the OS signals completion. `Task.Run(work)` instead queues `work` to the
thread pool: a pool thread executes it and stays blocked for the whole duration of any synchronous I/O inside. In a
UI application this is useful (the UI thread stays free), but in ASP.NET Core every request already runs on the pool,
so wrapping just swaps one pool thread for another. Stephen Cleary's guideline: use `Task.Run` to *call* CPU-bound
code from a UI, not in the *implementation* of a library method.

## Example (smelly)

```csharp
public class InvoiceArchive
{
    // SMELL: "Async" in name only; a pool thread is blocked by synchronous I/O
    public Task<string> LoadAsync(string invoiceNumber) =>
        Task.Run(() => File.ReadAllText(PathFor(invoiceNumber)));

    // SMELL: CPU-bound work hidden behind an async facade in a library
    public Task<byte[]> RenderPdfAsync(Invoice invoice) =>
        Task.Run(() => PdfRenderer.Render(invoice));

    private static string PathFor(string n) => Path.Combine("archive", $"{n}.json");
}
```

## Solution (refactored)

```csharp
public class InvoiceArchive
{
    // REFACTOR: real asynchronous I/O, with cancellation
    public Task<string> LoadAsync(string invoiceNumber, CancellationToken ct = default) =>
        File.ReadAllTextAsync(PathFor(invoiceNumber), ct);

    // REFACTOR: CPU-bound work exposed honestly as synchronous
    public byte[] RenderPdf(Invoice invoice) => PdfRenderer.Render(invoice);

    private static string PathFor(string n) => Path.Combine("archive", $"{n}.json");
}

// The UI decides to offload: var pdf = await Task.Run(() => archive.RenderPdf(invoice));
```

## Recommended refactorings

- **Use the real asynchronous API** (`ReadAllTextAsync`, `ExecuteReaderAsync`, `HttpClient`, `Stream.ReadAsync`).
- **Expose CPU-bound work synchronously** and let the caller decide whether to use `Task.Run`.
- **Propagate `CancellationToken`** through genuinely asynchronous methods.
- If no async API exists, **keep the method synchronous** rather than faking it.

## When it may be acceptable

- **UI applications** (WPF, WinForms, MAUI) calling CPU-bound or legacy blocking code from an event handler, to keep
  the UI responsive.
- Deliberate parallelism: starting several CPU-bound computations at once and awaiting them with `Task.WhenAll`.
- Implementing an interface that imposes a `Task`-returning signature: then prefer `Task.FromResult` for synchronous
  results instead of `Task.Run`.

## Related smells

- [Sync over Async (.Result / .Wait())](sync-over-async.md): the mirror image of this smell.
- [async void Methods](async-void.md)
- [Fallacious Method Name](../10-names/fallacious-method-name.md)
- [Names Should Describe Side-Effects](../10-names/names-hiding-side-effects.md)

## Automatic detection

No standard analyzer flags `Task.Run` inside library implementations. Related rules help: `CA1849` and `VSTHRD103`
(call the async overload when one exists inside an async method), and `VSTHRD002` for the blocking calls that often
accompany it. Banning `Task.Run` in library projects with `BannedApiAnalyzers` (`RS0030`) is a practical option.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/FakeAsync/`](../../../csharp/src/CodeSmells/CsharpSpecific/FakeAsync/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Stephen Cleary, *Task.Run Etiquette Examples: Don't Use Task.Run in the Implementation*:
  https://blog.stephencleary.com/2013/11/taskrun-etiquette-examples-dont-use.html
- David Fowler, *AsyncGuidance* ("Avoid using Task.Run for long-running work that blocks the thread"):
  https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md
- Microsoft Learn, *Asynchronous programming scenarios* (I/O-bound vs CPU-bound):
  https://learn.microsoft.com/dotnet/csharp/asynchronous-programming/async-scenarios
- Microsoft Learn, *Asynchronous wrappers for synchronous methods*:
  https://learn.microsoft.com/dotnet/standard/asynchronous-programming-patterns/async-wrappers-for-synchronous-methods
