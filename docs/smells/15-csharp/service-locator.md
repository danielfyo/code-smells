# Service Locator Anti-pattern

> **ID:** CS122 · **Category:** C#/.NET-specific · **Sources:** M. Seemann

## Definition

A class obtains its dependencies by asking a global container or registry (`IServiceProvider`,
`ServiceLocator.Current`, a `static Container`) from inside its methods or constructor, instead of declaring them in
its constructor. The real dependencies are **hidden** in the implementation: the class's public API does not say
what it needs in order to work.

## Symptoms

- Constructors that take only `IServiceProvider` and call `GetRequiredService<T>()`.
- Calls to `ServiceLocator.Resolve<T>()` or `App.Services.GetService<T>()` scattered across the code.
- `InvalidOperationException: No service for type 'X' has been registered` at runtime, not at startup.
- Tests that need a full container just to exercise one class.

## Common causes

- Avoiding constructors with many parameters (a symptom that the class does too much).
- Migrating from frameworks without constructor injection.
- Accessing services from places where "you cannot inject" (static methods, entities, attributes).

## Why it is a problem

- **Hidden dependencies**: to know what the class needs you must read all its code.
- **Runtime errors** instead of compile-time or startup errors.
- **Harder tests**: you need to configure a container or a fake locator.
- **Coupling to the container**: the whole application depends on DI infrastructure.
- **Breaks encapsulation**: the class's usage contract is incomplete.

## How it works under the hood

In `Microsoft.Extensions.DependencyInjection`, the container builds each service by analysing its **constructor**
and recursively resolving its parameters; that is how it can validate the object graph at startup
(`ValidateOnBuild`) and detect captive dependencies (`ValidateScopes`, on by default in Development). When a class
asks `IServiceProvider` for services at runtime, the container only sees an `IServiceProvider` parameter and cannot
validate anything: the failure appears when that line executes. Moreover, resolving a *scoped* service from the
root provider effectively turns it into a singleton, another mistake that constructor injection would expose.
Seemann frames it this way: the problem is not the mechanics of resolving, but the **role** the container plays;
using it only in the Composition Root is fine.

## Example (smelly)

```csharp
public class CheckoutService(IServiceProvider services)
{
    public async Task<Receipt> CheckoutAsync(Cart cart, CancellationToken ct)
    {
        // SMELL: hidden dependencies discovered only at runtime
        var pricing = services.GetRequiredService<IPricingService>();
        var payments = services.GetRequiredService<IPaymentGateway>();
        var orders = services.GetRequiredService<IOrderRepository>();

        decimal total = pricing.Total(cart);
        await payments.ChargeAsync(cart.CustomerId, total, ct);
        return await orders.CreateAsync(cart, total, ct);
    }
}
```

## Solution (refactored)

```csharp
// REFACTOR: constructor injection; the contract is explicit
public class CheckoutService(
    IPricingService pricing,
    IPaymentGateway payments,
    IOrderRepository orders)
{
    public async Task<Receipt> CheckoutAsync(Cart cart, CancellationToken ct)
    {
        decimal total = pricing.Total(cart);
        await payments.ChargeAsync(cart.CustomerId, total, ct);
        return await orders.CreateAsync(cart, total, ct);
    }
}
// Test: new CheckoutService(fakePricing, fakePayments, fakeOrders) — no container needed
```

## Recommended refactorings

- **Constructor Injection**: declare each dependency as a constructor parameter.
- **Restrict container usage to the Composition Root** (`Program.cs`, host configuration).
- If objects must be created on demand, **inject a typed factory** (`Func<T>`, `IXFactory`) or
  `IServiceScopeFactory` in infrastructure (for example, a `BackgroundService` creating one scope per message).
- If the constructor ends up with too many parameters, **split the class** (Extract Class, Facade Services).

## When it may be acceptable

- **Framework infrastructure**: factory-based middleware, a `BackgroundService` creating scopes with
  `IServiceScopeFactory`, filters or model binders activated by the framework without constructor injection.
- The Composition Root itself, which by definition resolves services from the container.
- Integration with legacy frameworks that do not allow constructor injection, wrapped in an adapter.

## Related smells

- [Control Freak (newing dependencies)](new-in-constructor.md)
- [Global Data](../05-couplers/global-data.md)
- [Logical Dependency Not Made Physical](../11-general/hidden-logical-dependency.md)
- [Static Mutable State](static-mutable-state.md)
- [Large Class / God Class](../01-bloaters/large-class.md)

## Automatic detection

There is no standard .NET analyzer rule. It is found in code review by looking for `IServiceProvider` as a
constructor parameter of application or domain classes, with `BannedApiAnalyzers` (`RS0030`) or architecture tests
(NetArchTest, ArchUnitNET) that forbid that dependency outside the infrastructure layer. At runtime,
`ValidateOnBuild` and `ValidateScopes` only help when constructor injection is used.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/ServiceLocator/`](../../../csharp/src/CodeSmells/CsharpSpecific/ServiceLocator/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Mark Seemann and Steven van Deursen, *Dependency Injection Principles, Practices, and Patterns* (Manning, 2019),
  chapter 5, "DI anti-patterns".
- Mark Seemann, *Service Locator is an Anti-Pattern*: https://blog.ploeh.dk/2010/02/03/ServiceLocatorisanAnti-Pattern/
- Microsoft Learn, *Dependency injection guidelines* (avoid the service locator pattern):
  https://learn.microsoft.com/dotnet/core/extensions/dependency-injection-guidelines
- Martin Fowler, *Inversion of Control Containers and the Dependency Injection pattern*:
  https://martinfowler.com/articles/injection.html
