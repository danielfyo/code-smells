# Control Freak (newing dependencies)

> **ID:** CS130 · **Category:** C#/.NET-specific · **Sources:** M. Seemann

## Definition

A class creates its own *volatile dependencies* with `new` (repositories, gateways, clients, clocks, loggers) inside
its constructor or methods, instead of receiving them from outside. Mark Seemann calls this the **Control Freak**
anti-pattern: the class insists on controlling the lifetime and concrete type of everything it uses, which makes it
impossible to substitute, configure or test those dependencies.

## Symptoms

- `_repository = new SqlOrderRepository("Server=...");` in a constructor.
- `new SmtpEmailSender()`, `new HttpClient()` or `new StripeGateway()` inside business methods.
- Unit tests that hit a real database, SMTP server or HTTP API, or that cannot be written at all.
- Connection strings or configuration hard-coded in deep layers to feed those `new` calls.
- Interfaces declared (`IOrderRepository`) but the field is assigned a concrete type created locally.

## Common causes

- It is the most direct way to get an object working.
- Not knowing dependency injection or thinking it is "only for frameworks".
- Avoiding long constructor parameter lists.

## Why it is a problem

- **Untestable**: the real dependency always runs; it cannot be replaced by a fake or stub.
- **Tight coupling** to concrete implementations: switching from SQL Server to another store means editing the class.
- **Hidden dependencies**: the constructor signature lies about what the class needs.
- **Lifetime mismanagement**: each instance creates its own connections or clients (see
  [new HttpClient per Request](httpclient-per-request.md)), and nobody disposes them properly.
- **Configuration leaks** into low-level classes.

## How it works under the hood

`new` binds the caller at compile time to a specific concrete type and its constructor; the decision cannot be
changed without recompiling the class. Dependency injection inverts that decision: the class declares abstractions in
its constructor and an external **Composition Root** (in .NET, `Program.cs` with
`Microsoft.Extensions.DependencyInjection`) decides which implementation to create, with which configuration and
which lifetime (`AddSingleton`, `AddScoped`, `AddTransient`). The container also disposes the `IDisposable` services
it created at the end of their scope. Seemann distinguishes **stable dependencies** (BCL types, pure helpers,
value objects), which are fine to `new`, from **volatile dependencies** (I/O, nondeterminism, things still under
development), which should be injected.

## Example (smelly)

```csharp
public class InvoiceService
{
    private readonly SqlInvoiceRepository _repository;
    private readonly SmtpEmailSender _email;

    public InvoiceService()
    {
        // SMELL: the class decides concrete types, configuration and lifetime
        _repository = new SqlInvoiceRepository("Server=prod-db;Database=Billing;");
        _email = new SmtpEmailSender("smtp.example.com", 25);
    }

    public async Task IssueAsync(Invoice invoice)
    {
        invoice.IssuedAt = DateTime.UtcNow;   // another hidden volatile dependency
        await _repository.SaveAsync(invoice);
        await _email.SendAsync(invoice.CustomerEmail, $"Invoice {invoice.Number}");
    }
}
```

## Solution (refactored)

```csharp
// REFACTOR: constructor injection of abstractions; the Composition Root decides
public class InvoiceService(
    IInvoiceRepository repository,
    IEmailSender email,
    TimeProvider clock)
{
    public async Task IssueAsync(Invoice invoice, CancellationToken ct = default)
    {
        invoice.IssuedAt = clock.GetUtcNow();
        await repository.SaveAsync(invoice, ct);
        await email.SendAsync(invoice.CustomerEmail, $"Invoice {invoice.Number}", ct);
    }
}

// Program.cs
// builder.Services.AddScoped<IInvoiceRepository, SqlInvoiceRepository>();
// builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();
// builder.Services.AddSingleton(TimeProvider.System);
```

## Recommended refactorings

- **Constructor Injection**: receive volatile dependencies as constructor parameters typed as abstractions.
- **Extract Interface** for concrete classes that need to be substituted.
- **Move creation to the Composition Root** and configure it with the Options pattern rather than literals.
- **Abstract Factory** (or `Func<T>`) when the class genuinely needs to create instances at runtime.
- If the constructor grows too large, it is a sign to **split the class** (Extract Class, Facade Services).

## When it may be acceptable

- **Stable dependencies**: `StringBuilder`, `List<T>`, value objects, DTOs, pure helper classes.
- The Composition Root itself, where all `new` calls for the object graph belong.
- Small scripts and prototypes with no tests and a short life.

## Related smells

- [Service Locator Anti-pattern](service-locator.md): the other half of Seemann's DI anti-patterns.
- [DateTime.Now Hidden Dependency](datetime-now-dependency.md)
- [new HttpClient per Request](httpclient-per-request.md)
- [Configurable Data at Low Levels](../11-general/configurable-data-at-low-levels.md)
- [Inappropriate Static](../02-oo-abusers/inappropriate-static.md)

## Automatic detection

No standard .NET analyzer flags `new` of volatile dependencies. Useful approaches are architecture tests (NetArchTest,
ArchUnitNET) that forbid application-layer classes from referencing infrastructure types, `BannedApiAnalyzers`
(`RS0030`) to ban specific constructors outside the Composition Root, and dependency graphs in tools such as NDepend.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/NewInConstructor/`](../../../csharp/src/CodeSmells/CsharpSpecific/NewInConstructor/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Mark Seemann and Steven van Deursen, *Dependency Injection Principles, Practices, and Patterns* (Manning, 2019),
  chapter 5, "DI anti-patterns" (Control Freak) and chapter 1 (stable vs volatile dependencies).
- Microsoft Learn, *Dependency injection in .NET*: https://learn.microsoft.com/dotnet/core/extensions/dependency-injection
- Microsoft Learn, *Dependency injection guidelines*:
  https://learn.microsoft.com/dotnet/core/extensions/dependency-injection-guidelines
- Martin Fowler, *Inversion of Control Containers and the Dependency Injection pattern*:
  https://martinfowler.com/articles/injection.html
