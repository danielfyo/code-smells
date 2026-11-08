# Rethrowing with `throw ex`

> **ID:** CS116 · **Category:** C#/.NET-specific · **Sources:** CA2200

## Definition

Inside a `catch (Exception ex)` block, the caught exception is rethrown with `throw ex;` instead of `throw;`.
Although it looks equivalent, `throw ex;` **resets the stack trace** to the line of the `catch`, and the information
about where the error actually originated is lost.

## Symptoms

- `catch (Exception ex) { Log(ex); throw ex; }`.
- Stack traces in the logs that always end in the same "intermediate" method (a repository, a service) and never
  show the method that actually failed.
- Difficulty reproducing production errors from their stack traces.

## Common causes

- Analogy with other languages, where rethrowing the variable preserves the trace.
- Thinking that `throw;` "loses" the exception or that it must be named.
- Code that logs the error and rethrows it out of habit.

## Why it is a problem

- **Much harder diagnosis**: the trace points at the `catch`, not at the cause.
- **Debugging time**: you have to guess which call inside the `try` block failed.
- **Information lost for good**: it cannot be recovered from the logs.

## How it works under the hood

In the CLR, an exception's stack trace is filled in as the exception propagates through the frames. The IL
instructions differ: `throw ex;` emits `throw`, which treats the object as a **new** exception thrown from that
point and resets its `StackTrace` from that frame upwards. `throw;` emits `rethrow`, which continues propagating
the in-flight exception **preserving the original trace**. If you need to rethrow later (outside the `catch`, or on
another thread), `ExceptionDispatchInfo.Capture(ex).Throw()` preserves the original trace and appends a marker for
the rethrow point; that is how `await` propagates exceptions from tasks.

## Example (smelly)

```csharp
public Invoice Generate(int orderId)
{
    try
    {
        Order order = _orders.Get(orderId);
        decimal tax = _taxCalculator.Calculate(order);   // did it fail here...
        return _builder.Build(order, tax);               // ...or here?
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error generating invoice {OrderId}", orderId);
        throw ex;   // SMELL: the trace now starts in Generate
    }
}
```

## Solution (refactored)

```csharp
public Invoice Generate(int orderId)
{
    try
    {
        Order order = _orders.Get(orderId);
        decimal tax = _taxCalculator.Calculate(order);
        return _builder.Build(order, tax);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error generating invoice {OrderId}", orderId);
        throw;      // REFACTOR: rethrow preserves the original trace
    }
}

// To add context, wrap while keeping the cause:
// throw new InvoiceGenerationException(orderId, ex);
```

## Recommended refactorings

- **Replace `throw ex;` with `throw;`**.
- **Wrap with `InnerException`** when you want to add domain context: `throw new XException(msg, ex)`.
- **`ExceptionDispatchInfo.Capture(ex).Throw()`** to rethrow outside the `catch` block.
- **Remove the `catch`** if it only logs and rethrows: better to log once at a central point (middleware, global
  handler).
- Use **exception filters** (`catch (X ex) when (...)`) to avoid catching what you will not handle.

## When it may be acceptable

- Practically never. If you deliberately want to hide internal details (for example at a security boundary), the
  right move is to throw a **new** exception with an appropriate message, not to rethrow the same one.

## Related smells

- [Catching General Exception](catch-general-exception.md)
- [Lost Error Wrapping (Go)](../17-go/lost-error-wrapping.md)
- [Swallowed Exceptions / Afraid to Fail](../08-error-handling/swallowed-exceptions.md)
- [Bare except (Python)](../14-python/bare-except.md)

## Automatic detection

- **.NET analyzers**: `CA2200` (Rethrow to preserve stack details), enabled as a warning by default in recent SDKs.
- **SonarAnalyzer for C#** and **Roslynator** include equivalent rules.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/ThrowEx/`](../../../csharp/src/CodeSmells/CsharpSpecific/ThrowEx/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, CA2200: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2200
- Microsoft Learn, *Best practices for exceptions*:
  https://learn.microsoft.com/dotnet/standard/exceptions/best-practices-for-exceptions
- Microsoft Learn, `ExceptionDispatchInfo`:
  https://learn.microsoft.com/dotnet/api/system.runtime.exceptionservices.exceptiondispatchinfo
- Microsoft Learn, *Exception-handling statements*:
  https://learn.microsoft.com/dotnet/csharp/language-reference/statements/exception-handling-statements
