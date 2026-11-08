# DateTime.Now Hidden Dependency

> **ID:** CS121 · **Category:** C#/.NET-specific · **Sources:** .NET 8 TimeProvider

## Definition

Business logic reads the system clock directly (`DateTime.Now`, `DateTime.UtcNow`, `DateTimeOffset.Now`,
`Stopwatch`, `Task.Delay`) instead of receiving time as a dependency. The result depends on when the code runs, so
it cannot be tested deterministically and is hard to reason about.

## Symptoms

- `if (invoice.DueDate < DateTime.Now)` inside entities or domain services.
- Tests that fail at midnight, at month end, in leap years or when daylight saving time changes.
- Tests that use real `Thread.Sleep` or `Task.Delay` to wait for "time to pass".
- A mix of `DateTime.Now` and `DateTime.UtcNow` in the same flow.
- Home-grown `IDateTimeProvider` interfaces, different in every project.

## Common causes

- `DateTime.Now` is static and always at hand.
- Not treating time as an input to the system.
- No standard abstraction existed before .NET 8.

## Why it is a problem

- **Non-deterministic tests**, or edge cases (due dates, expirations, schedules) that cannot be tested at all.
- **Slow tests** that wait in real time.
- **Time-zone bugs**: `DateTime.Now` depends on the server configuration.
- **Hidden dependency**: the method signature does not reveal that its result depends on the time.

## How it works under the hood

`DateTime.Now` is a static property that reads the operating system clock and converts it to the process's local
time zone; `DateTime.UtcNow` skips the conversion. Being static, they cannot be substituted in tests without
*shimming* tools. .NET 8 introduced the abstract class `System.TimeProvider`, with `GetUtcNow()`, `GetLocalNow()`,
`LocalTimeZone`, `GetTimestamp()` and `CreateTimer(...)`. `TimeProvider.System` is the real implementation, and
`Task.Delay`, `Task.WaitAsync` and `CancellationTokenSource` accept a `TimeProvider`. The
`Microsoft.Extensions.TimeProvider.Testing` package provides `FakeTimeProvider`, which lets tests set the time and
advance it (`Advance`) instantly.

## Example (smelly)

```csharp
public class SubscriptionService(ISubscriptionRepository repository)
{
    public async Task<bool> IsActiveAsync(int customerId)
    {
        var sub = await repository.GetAsync(customerId);
        // SMELL: depends on the real clock and the server's time zone
        return sub.ExpiresAt > DateTime.Now;
    }

    public decimal LateFee(Invoice invoice) =>
        (DateTime.Now - invoice.DueDate).Days * 1.5m;   // SMELL: impossible to test
}
```

## Solution (refactored)

```csharp
public class SubscriptionService(ISubscriptionRepository repository, TimeProvider clock)
{
    // REFACTOR: time is an explicit, injectable dependency
    public async Task<bool> IsActiveAsync(int customerId)
    {
        var sub = await repository.GetAsync(customerId);
        return sub.ExpiresAt > clock.GetUtcNow();
    }

    public decimal LateFee(Invoice invoice) =>
        Math.Max(0, (clock.GetUtcNow() - invoice.DueDate).Days) * 1.5m;
}

// Program.cs: builder.Services.AddSingleton(TimeProvider.System);
// Test:       var clock = new FakeTimeProvider(new DateTimeOffset(2025, 3, 1, 0, 0, 0, TimeSpan.Zero));
```

## Recommended refactorings

- **Inject `TimeProvider`** (or, on older targets, the `Microsoft.Bcl.TimeProvider` package).
- **Pass the time as a parameter** to pure domain functions (`IsExpired(DateTimeOffset now)`).
- **Work in UTC** (`DateTimeOffset`) and convert to local time only for display.
- Use `FakeTimeProvider` in tests instead of real waits.

## When it may be acceptable

- Logging and telemetry, where the real time is exactly what you want.
- Scripts and tools without time-dependent logic to test.
- The composition root, which is where `TimeProvider.System` is registered.

## Related smells

- [Control Freak (newing dependencies)](new-in-constructor.md)
- [Static Mutable State](static-mutable-state.md)
- [Fragile Test / Testing Implementation Details](../12-tests/fragile-test.md)
- [Sleepy Test](../12-tests/sleepy-test.md)
- [Inappropriate Static](../02-oo-abusers/inappropriate-static.md)

## Automatic detection

No .NET analyzer rule flags it by default. The usual approach is **Microsoft.CodeAnalysis.BannedApiAnalyzers** (rule
`RS0030`): list `P:System.DateTime.Now`, `P:System.DateTime.UtcNow` and `P:System.DateTimeOffset.Now` in
`BannedSymbols.txt` to forbid them in domain projects. Architecture tests (NetArchTest, ArchUnitNET) also help.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/DatetimeNowDependency/`](../../../csharp/src/CodeSmells/CsharpSpecific/DatetimeNowDependency/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, *What is TimeProvider?*: https://learn.microsoft.com/dotnet/standard/datetime/timeprovider-overview
- Microsoft Learn, *Testing with FakeTimeProvider*: https://learn.microsoft.com/dotnet/core/extensions/timeprovider-testing
- Microsoft Learn, `System.TimeProvider`: https://learn.microsoft.com/dotnet/api/system.timeprovider
- Mark Seemann and Steven van Deursen, *Dependency Injection Principles, Practices, and Patterns* (Manning, 2019).
