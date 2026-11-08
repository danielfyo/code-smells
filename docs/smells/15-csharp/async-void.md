# async void Methods

> **ID:** CS113 · **Category:** C#/.NET-specific · **Sources:** D. Fowler AsyncGuidance; CA/VSTHRD100

## Definition

An asynchronous method is declared `async void` instead of `async Task`. The caller gets no `Task` it can await,
compose or inspect, and exceptions thrown by the method never come back to the caller: they are re-raised on the
synchronization context or the thread pool, where they usually **crash the process**.

## Symptoms

- `public async void SaveAsync(...)` methods outside event handlers.
- `async () => ...` lambdas passed to `Action` parameters (for example `List<T>.ForEach`, `Timer`).
- Tests that pass even though the code fails, because they finish before the operation does.
- Process crashes with `UnhandledException` and no clear caller in the stack trace.
- "Fire and forget" calls whose results or errors nobody observes.

## Common causes

- Making an existing `void` method asynchronous by changing only the keyword.
- Passing async lambdas to APIs that expect `Action`.
- Wanting "not to block" without thinking about who handles the errors.

## Why it is a problem

- **Uncatchable exceptions**: a `try/catch` around the call never sees them.
- **Process crash**: in ASP.NET Core or a worker service, an unhandled exception on the thread pool terminates the
  application.
- **Cannot be awaited**: the caller does not know when it finishes, causing race conditions and use of already
  disposed objects (for example, a request `DbContext` after the request has ended).
- **Hard to test**: the test cannot `await` the method.

## How it works under the hood

The compiler turns every `async` method into a state machine driven by a *builder*. For `async Task` it uses
`AsyncTaskMethodBuilder`, which captures exceptions and stores them in the returned `Task`: they are re-thrown when
someone awaits it. For `async void` it uses `AsyncVoidMethodBuilder`, which has **nowhere to store them**: on start
it calls `SynchronizationContext.OperationStarted()` and, if an exception occurs, it posts it to the captured
`SynchronizationContext` or, if there is none (ASP.NET Core, console), throws it on a thread-pool thread. An
unhandled exception on the thread pool raises `AppDomain.UnhandledException` and terminates the process.
`async void` exists only so that event handlers (`void Handler(object sender, EventArgs e)`) can be asynchronous.

## Example (smelly)

```csharp
public class OrderService(IOrderRepository repository, IEmailSender email)
{
    // SMELL: the caller can neither await nor catch errors
    public async void PlaceOrder(Order order)
    {
        await repository.SaveAsync(order);
        await email.SendConfirmationAsync(order.CustomerEmail); // if this fails, the process dies
    }
}

// In the controller:
// try { service.PlaceOrder(order); } catch (Exception) { /* never reached */ }
// return Ok();  // responds before the order has been saved
```

## Solution (refactored)

```csharp
public class OrderService(IOrderRepository repository, IEmailSender email)
{
    // REFACTOR: async Task allows await, composition and exception propagation
    public async Task PlaceOrderAsync(Order order, CancellationToken ct = default)
    {
        await repository.SaveAsync(order, ct);
        await email.SendConfirmationAsync(order.CustomerEmail, ct);
    }
}

// In the controller:
// await service.PlaceOrderAsync(order, HttpContext.RequestAborted);
// return Ok();
```

If background work is genuinely needed, enqueue it to a `BackgroundService` (for example via
`System.Threading.Channels`) that owns error handling and lifetime.

## Recommended refactorings

- **Change the signature to `async Task`** (or `Task<T>`) and propagate `await` up to the caller ("async all the way").
- **Replace `Action` with `Func<Task>`** in your own APIs that accept async callbacks.
- In unavoidable event handlers, **wrap the body in `try/catch`** and log the error.
- For "fire and forget", **delegate to a background service** with a queue and error handling.

## When it may be acceptable

- UI **event handlers** (WinForms, WPF, MAUI) whose signature imposes `void`; they must catch their own exceptions.
- Overrides of framework `void` methods that offer no alternative, with the same care.

## Related smells

- [Sync over Async](sync-over-async.md)
- [Fake Async (Task.Run wrapping)](fake-async.md)
- [Swallowed Exceptions / Afraid to Fail](../08-error-handling/swallowed-exceptions.md)
- [Goroutine Leak (Go)](../17-go/goroutine-leak.md): the same problem of concurrent work with no owner.

## Automatic detection

- **Microsoft.VisualStudio.Threading.Analyzers**: `VSTHRD100` (Avoid async void methods), `VSTHRD101` (Avoid
  unsupported async delegates, i.e. async lambdas converted to `void`) and `VSTHRD110` (Observe result of async calls).
- **SonarAnalyzer for C#** includes an equivalent rule ("async methods should not return void").
- Modern test frameworks (xUnit, NUnit, MSTest) and their analyzers warn about or reject `async void` test methods;
  they must be declared `async Task`.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/AsyncVoid/`](../../../csharp/src/CodeSmells/CsharpSpecific/AsyncVoid/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- David Fowler, *AsyncGuidance* ("Avoid using async void"):
  https://github.com/davidfowl/AspNetCoreDiagnosticScenarios/blob/master/AsyncGuidance.md
- Stephen Cleary, *Async/Await - Best Practices in Asynchronous Programming* (MSDN Magazine, 2013):
  https://learn.microsoft.com/archive/msdn-magazine/2013/march/async-await-best-practices-in-asynchronous-programming
- Microsoft Learn, *Asynchronous programming with async and await*:
  https://learn.microsoft.com/dotnet/csharp/asynchronous-programming/
- vs-threading analyzers: https://github.com/microsoft/vs-threading/blob/main/doc/analyzers/index.md
