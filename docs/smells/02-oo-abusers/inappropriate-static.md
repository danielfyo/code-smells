# Inappropriate Static

> **ID:** CS011 · **Category:** Object-Orientation Abusers · **Sources:** Clean Code G18
>
> Static functions that should be polymorphic or that hide dependencies, making them hard to replace and test.

## Definition

**Inappropriate static** (*Clean Code* G18) happens when a method is declared static (or implemented as a
global function, singleton or package variable) even though its behavior should be able to vary
polymorphically, or it depends on resources that should be replaceable (clock, network, database,
configuration).

Martin suggests the rule: when in doubt, make the method non-static. A static method that hides a
dependency makes all the code that calls it hard to test and extend.

## Symptoms

- Calls to `DateTime.Now`, `Database.Query(...)`, `HttpHelper.Get(...)` from business methods.
- Static utility classes that access external resources.
- Tests that need monkey patching or libraries for mocking statics.
- Static methods with a `switch` on a parameter that could be polymorphic.

## Common causes

- Convenience: nothing needs to be constructed or injected.
- Confusing "has no state" with "never needs to vary".
- Legacy patterns such as *Singleton* or *Service Locator*.

## Why it is a problem

- Hidden dependencies: the signature does not reveal what the function needs.
- Slow, brittle or non-deterministic tests (they depend on the clock, the network...).
- The implementation cannot be swapped through configuration or at runtime.

## Example (smelly)

```csharp
public static class PricingRules
{
    public static decimal Discount(decimal amount)
    {
        // SMELL: hidden dependency on the system clock
        return DateTime.Now.DayOfWeek == DayOfWeek.Friday ? amount * 0.1m : 0m;
    }
}

public class Checkout
{
    public decimal Total(decimal amount) => amount - PricingRules.Discount(amount);
}
```

## Solution (refactored)

```csharp
public interface IDiscountPolicy { decimal Discount(decimal amount); }

public class FridayDiscount : IDiscountPolicy
{
    private readonly TimeProvider _clock;
    public FridayDiscount(TimeProvider clock) => _clock = clock;

    public decimal Discount(decimal amount) =>
        _clock.GetLocalNow().DayOfWeek == DayOfWeek.Friday ? amount * 0.1m : 0m;
}

public class Checkout
{
    private readonly IDiscountPolicy _policy;
    public Checkout(IDiscountPolicy policy) => _policy = policy;
    public decimal Total(decimal amount) => amount - _policy.Discount(amount);
}
```

The discount policy is replaceable and the clock is injected (`TimeProvider` is available since .NET 8), so tests are deterministic.

## Recommended refactorings

- **Replace Conditional with Polymorphism**: if the static method decides with a `switch`.
- **Move Function**: moves the method to an instance that can be injected.
- **Extract Interface**: defines the contract the clients need.
- **Parameterize Function**: passes the dependency (clock, configuration) as a parameter instead of reading it globally.

## When it may be acceptable

- Pure, deterministic functions with no possible variation (`Math.Max`, conversions, formatters without configuration).
- Static factories that only construct objects.
- In Go and Python, pure package/module functions are idiomatic; the problem is hidden state or dependencies, not the word `static`.

## Related smells

- [Global Data](../05-couplers/global-data.md) — statics with state are global data.
- [DateTime.Now Hidden Dependency](../15-csharp/datetime-now-dependency.md) — a concrete C# case: hidden dependency on the clock.
- [Service Locator Anti-pattern](../15-csharp/service-locator.md) — another way of hiding dependencies behind statics.
- [Mutable Package-level State](../17-go/package-level-state.md) — the Go equivalent.
- [Static Mutable State](../15-csharp/static-mutable-state.md) — mutable statics in C#.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `W0603 global-statement`; Ruff `PLW0603`. Review `@staticmethod` methods that access external resources. |
| C# | SonarQube `S2696` (instance methods writing static fields); `CA2211` (non-constant fields should not be visible). Note: `CA1822` (mark members as `static`) suggests the opposite and should be applied with judgment. |
| React + TS | `no-restricted-imports`/`no-restricted-syntax` to forbid direct use of modules with effects (e.g. `Date.now()` in domain logic). |
| Go | golangci-lint `gochecknoglobals` (package variables) and `forbidigo` (forbid calls such as `time.Now` in certain packages). |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/oo_abusers/inappropriate_static/`](../../../python/code_smells/oo_abusers/inappropriate_static/) |
| C# | [`csharp/src/CodeSmells/OoAbusers/InappropriateStatic/`](../../../csharp/src/CodeSmells/OoAbusers/InappropriateStatic/) |
| React + TS | [`react-ts/src/smells/oo_abusers/inappropriate-static/`](../../../react-ts/src/smells/oo_abusers/inappropriate-static/) |
| Go | [`go/smells/oo_abusers/inappropriate-static/`](../../../go/smells/oo_abusers/inappropriate-static/) |
| Angular | [`angular/src/smells/oo_abusers/inappropriate-static/`](../../../angular/src/smells/oo_abusers/inappropriate-static/) |

## References

- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Prentice Hall (chapter 17, "Smells and Heuristics").
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
