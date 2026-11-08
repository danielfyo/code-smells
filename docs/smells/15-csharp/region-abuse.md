# #region Abuse

> **ID:** CS131 · **Category:** C#/.NET-specific · **Sources:** .NET community

## Definition

`#region` / `#endregion` directives are used to fold away parts of huge classes or methods ("Fields", "Private
methods", "Validation", "Legacy") so the file *looks* tidy in the editor. The regions hide the size and the mixed
responsibilities of the code instead of fixing them: the class is still enormous, it just no longer looks that way.

## Symptoms

- Classes of hundreds or thousands of lines organized into a dozen collapsed regions.
- Regions named after responsibilities (`#region Email`, `#region PDF generation`, `#region Pricing`) inside a
  single class: each one is a candidate class.
- Regions **inside methods** to hide blocks of a long method.
- Regions wrapping commented-out or dead code (`#region Old implementation`).
- Mandatory region templates (`#region Constructors`, `#region Properties`) in coding standards.

## Common causes

- Using the editor to manage complexity instead of the design.
- Team conventions inherited from older .NET or code generators.
- Avoiding the effort of splitting a class that "works".

## Why it is a problem

- **Hides the real smell**: [Large Class / God Class](../01-bloaters/large-class.md) or
  [Long Method](../01-bloaters/long-method.md) become invisible at a glance.
- **Code review becomes harder**: collapsed sections hide changes and context.
- **Comments as deodorant**: the region name is a comment that tries to compensate for missing structure.
- **Obsolete names**: region titles drift away from their contents over time.

## How it works under the hood

`#region` and `#endregion` are C# **preprocessor directives** with no semantic meaning: the compiler ignores them
completely and they produce no IL. Their only effect is in IDEs (Visual Studio, Rider, VS Code), which use them as
outlining markers to collapse text. C# already has real structural tools to organize code — classes, `partial`
classes, nested types, files, namespaces, extension methods, and local functions — all of which the compiler
understands and enforces, unlike a region.

## Example (smelly)

```csharp
public class OrderManager
{
    #region Fields
    private readonly string _connectionString;
    private readonly SmtpClient _smtp;
    #endregion

    #region Pricing            // SMELL: a whole responsibility hidden in a fold
    public decimal CalculateTotal(Order order) { /* 120 lines */ return 0; }
    public decimal ApplyDiscounts(Order order) { /* 80 lines */ return 0; }
    #endregion

    #region Persistence
    public void Save(Order order) { /* raw ADO.NET, 150 lines */ }
    #endregion

    #region Email notifications
    public void SendConfirmation(Order order) { /* 90 lines */ }
    #endregion
}
```

## Solution (refactored)

```csharp
// REFACTOR: each former region becomes a cohesive class with a single responsibility
public class PricingService
{
    public decimal CalculateTotal(Order order) => order.Lines.Sum(l => l.Subtotal);
}

public class OrderRepository(BillingDbContext db)
{
    public Task SaveAsync(Order order, CancellationToken ct) { db.Add(order); return db.SaveChangesAsync(ct); }
}

public class OrderNotifier(IEmailSender email)
{
    public Task SendConfirmationAsync(Order order, CancellationToken ct) =>
        email.SendAsync(order.CustomerEmail, $"Order {order.Number} confirmed", ct);
}

public class OrderManager(PricingService pricing, OrderRepository orders, OrderNotifier notifier)
{
    // Only orchestration remains here
}
```

## Recommended refactorings

- **Extract Class** for every region that represents a responsibility.
- **Extract Method** / local functions for regions inside methods.
- **Move Method** to the classes that own the data being manipulated.
- **Delete** regions wrapping dead or commented-out code (version control keeps the history).
- Remove region requirements from coding standards and rely on consistent member ordering instead.

## When it may be acceptable

- **Generated code** (designers, scaffolding) where regions separate machine-written sections.
- Grouping long but homogeneous, simple members, such as explicit interface implementations or P/Invoke declarations.
- Large test classes where regions group related scenarios, although nested classes usually work better.

## Related smells

- [Large Class / God Class](../01-bloaters/large-class.md)
- [Long Method](../01-bloaters/long-method.md)
- [Comments (as deodorant)](../04-dispensables/excessive-comments.md)
- [Commented-Out Code](../09-comments/commented-out-code.md)
- [Divergent Change](../03-change-preventers/divergent-change.md)

## Automatic detection

- **StyleCop.Analyzers**: `SA1124` (Do not use regions) and `SA1123` (Do not place regions within elements).
- Size metrics flag the underlying problem: lines of code per class/method, Visual Studio code metrics (maintainability
  index, class coupling), and tools such as NDepend or SonarQube.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/RegionAbuse/`](../../../csharp/src/CodeSmells/CsharpSpecific/RegionAbuse/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, *C# preprocessor directives* (`#region`):
  https://learn.microsoft.com/dotnet/csharp/language-reference/preprocessor-directives
- StyleCop.Analyzers, *SA1124 DoNotUseRegions*:
  https://github.com/DotNetAnalyzers/StyleCopAnalyzers/blob/master/documentation/SA1124.md
- Microsoft Learn, *Code metrics values*: https://learn.microsoft.com/visualstudio/code-quality/code-metrics-values
- Robert C. Martin, *Clean Code* (Prentice Hall, 2008), chapters 3 ("Functions") and 10 ("Classes").
