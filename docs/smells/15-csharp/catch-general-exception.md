# Catching General Exception

> **ID:** CS117 · **Category:** C#/.NET-specific · **Sources:** CA1031

## Definition

`catch (Exception)` (or an untyped `catch`) is used indiscriminately in the middle of business logic to treat every
failure the same way. That also catches programming errors (`NullReferenceException`, `ArgumentException`,
`InvalidOperationException`) and serious environment failures, which should propagate and become visible.

## Symptoms

- `try { ... } catch (Exception) { return false; }` or `return null;` in domain methods.
- `catch (Exception ex) { _logger.LogWarning(ex.Message); }` and execution carries on.
- Cancellations (`OperationCanceledException`) treated as errors or, worse, ignored.
- Bugs that never show up in the logs as exceptions, only as wrong data.

## Common causes

- Misunderstood defensive programming: "it must never fail".
- Not knowing which exceptions an API can throw.
- Copying the global-handler pattern into every method.

## Why it is a problem

- **Hidden programming errors**: a `NullReferenceException` is treated as "invalid order".
- **Inconsistent state**: the program continues after failing halfway through an operation.
- **Broken cancellation**: catching `OperationCanceledException` prevents an aborted request from finishing.
- **Hard diagnosis**: the real failure is turned into a distant symptom.

## How it works under the hood

In .NET every exception derives from `System.Exception`, so `catch (Exception)` intercepts any managed exception that
reaches that frame. Some cannot really be caught: `StackOverflowException` terminates the process, and since .NET
Core corrupted-state exceptions (such as `AccessViolationException`) are not delivered to `catch` blocks. `catch`
clauses are evaluated in order and the first compatible one wins; **exception filters**
(`catch (HttpRequestException ex) when (ex.StatusCode == ...)`) are evaluated *before* the stack unwinds, so an
unfiltered exception continues on its way with its trace intact. Cooperative cancellation is signalled by throwing
`OperationCanceledException` (or `TaskCanceledException`).

## Example (smelly)

```csharp
public async Task<bool> ChargeAsync(Order order, CancellationToken ct)
{
    try
    {
        var customer = await _customers.GetAsync(order.CustomerId, ct);
        await _gateway.ChargeAsync(customer.CardToken, order.Total, ct); // customer may be null
        return true;
    }
    catch (Exception ex)   // SMELL: NullReference, cancellation, bugs... all become "payment failed"
    {
        _logger.LogWarning("Payment failed: {Message}", ex.Message);
        return false;
    }
}
```

## Solution (refactored)

```csharp
public async Task<PaymentResult> ChargeAsync(Order order, CancellationToken ct)
{
    var customer = await _customers.GetAsync(order.CustomerId, ct)
        ?? throw new CustomerNotFoundException(order.CustomerId);
    try
    {
        await _gateway.ChargeAsync(customer.CardToken, order.Total, ct);
        return PaymentResult.Success();
    }
    catch (PaymentDeclinedException ex)    // REFACTOR: only the expected domain failure
    {
        _logger.LogInformation(ex, "Payment declined for order {OrderId}", order.Id);
        return PaymentResult.Declined(ex.Reason);
    }
    // Everything else (bugs, cancellation, network) propagates to the global handler
}
```

## Recommended refactorings

- **Catch specific types** that the code knows how to handle.
- **Use `when` filters** to narrow the catch even further.
- **Centralize generic handling** at a single point: ASP.NET Core middleware (`UseExceptionHandler`,
  `IExceptionHandler` in .NET 8), the loop of a `BackgroundService`, `Main`.
- **Do not catch `OperationCanceledException`** except to shut down cleanly.
- **Replace Exception with Result** when the failure is an expected business outcome.

## When it may be acceptable

- **System boundaries**: the global handler, a worker's main loop or an isolated plugin host, always logging the
  full exception.
- Code that cleans up and **rethrows** (`catch (Exception) { Rollback(); throw; }`).
- Non-critical "best effort" operations (telemetry, caching) where the failure is logged and consciously ignored.

## Related smells

- [Bare except (Python)](../14-python/bare-except.md)
- [Swallowed Exceptions / Afraid to Fail](../08-error-handling/swallowed-exceptions.md)
- [Exceptions for Control Flow](../08-error-handling/exceptions-for-control-flow.md)
- [Rethrowing with `throw ex`](throw-ex.md)
- [Ignored Errors (Go)](../17-go/ignored-errors.md)

## Automatic detection

- **.NET analyzers**: `CA1031` (Do not catch general exception types). It is disabled by default; enable it in
  `.editorconfig` (`dotnet_diagnostic.CA1031.severity = warning`).
- `CA2201` (Do not raise reserved exception types) covers the opposite side: throwing a generic `Exception`.
- **SonarAnalyzer for C#** includes similar rules for generic catches and empty `catch` blocks.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/CatchGeneralException/`](../../../csharp/src/CodeSmells/CsharpSpecific/CatchGeneralException/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, CA1031: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1031
- Microsoft Learn, *Best practices for exceptions*:
  https://learn.microsoft.com/dotnet/standard/exceptions/best-practices-for-exceptions
- Microsoft Learn, *Handle errors in ASP.NET Core*: https://learn.microsoft.com/aspnet/core/fundamentals/error-handling
- Microsoft Learn, *Cancellation in managed threads*:
  https://learn.microsoft.com/dotnet/standard/threading/cancellation-in-managed-threads
