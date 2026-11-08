# Large Class / God Class

> **ID:** CS002 · **Category:** Bloaters · **Sources:** Fowler 1999; Riel 1996
>
> A class with too many fields, methods and responsibilities that knows and does everything.

## Definition

A **large class** (also called a *God Class* or *Blob*) concentrates too many fields, methods and
responsibilities. Riel described it as the class that "knows everything and does everything", while
the rest of the system is reduced to data holders around it.

It is usually the sum of many small, reasonable changes: each new feature "fits" into the class that
already handles the data, until the class becomes the module's center of gravity and every change goes
through it.

## Symptoms

- Hundreds or thousands of lines and dozens of public methods.
- Many instance fields, often groupable by prefix (`invoice_*`, `shipping_*`).
- Subsets of methods that only use subsets of fields (low cohesion, high LCOM).
- Generic names: `Manager`, `Processor`, `Service`, `Helper`, `Controller` with nothing else.
- Almost every user story requires modifying this class.
- Many dependencies injected into the constructor (more than 5-7).

## Common causes

- Incremental growth without periodic refactoring.
- Confusing "related to the order" with "belongs to the Order class".
- Fear of creating new classes, or an architecture that penalizes adding files.
- Moving an ever-growing procedural script (*transaction script*) into a single object.

## Why it is a problem

- It violates the single responsibility principle: it has many reasons to change.
- It is a hotspot for merge conflicts and regressions.
- Testing it requires building a huge object with many mocked dependencies.
- It hides domain concepts that should have their own identity.

## Example (smelly)

```csharp
public class OrderManager
{
    private readonly List<Order> _orders = new();
    private string _smtpHost = "";
    private decimal _vatRate = 0.21m;

    public void AddOrder(Order o) { /* ... */ }
    public decimal CalculateTotal(Order o) { /* ... */ return 0; }
    public decimal CalculateTax(Order o) { /* ... */ return 0; }
    public string RenderInvoicePdf(Order o) { /* ... */ return ""; }
    public void SendConfirmationEmail(Order o) { /* uses _smtpHost */ }
    public void ExportToCsv(string path) { /* ... */ }
    public void ReserveStock(Order o) { /* ... */ }
}
```

## Solution (refactored)

```csharp
public class OrderRepository { public void Add(Order o) { /* ... */ } }

public class PriceCalculator
{
    private readonly decimal _vatRate;
    public PriceCalculator(decimal vatRate) => _vatRate = vatRate;
    public decimal Total(Order o) => o.Subtotal * (1 + _vatRate);
}

public class InvoiceRenderer { public string RenderPdf(Order o) => "..."; }
public class OrderNotifier { public void SendConfirmation(Order o) { } }
public class StockService  { public void Reserve(Order o) { } }
```

Each cohesive group of fields and methods has been extracted into its own class; each one now has a single reason to change.

## Recommended refactorings

- **Extract Class**: moves each cohesive group of fields and methods into a new class.
- **Extract Superclass**: when several responsibilities share common behavior.
- **Replace Type Code with Subclasses**: if part of the size comes from conditionals on a type.
- **Move Function**: moves each method to the class whose data it actually uses.
- **Extract Interface**: lets clients depend only on the part they need while the transition lasts.

## When it may be acceptable

- Deliberate facades (*Facade*) that only delegate and offer a stable entry point.
- Generated classes (API clients, ORM, gRPC) that are not edited by hand.
- Composition roots or dependency injection configuration modules.

## Related smells

- [Long Method](long-method.md) — long methods are the other usual symptom of uncontrolled growth.
- [Divergent Change](../03-change-preventers/divergent-change.md) — a large class changes for many different reasons.
- [Data Class](../04-dispensables/data-class.md) — the data classes around it are the other side of the God Class.
- [Feature Envy](../05-couplers/feature-envy.md) — its methods manipulate the data of satellite classes.
- [God Component / Large Component](../16-react-ts/god-component.md) — the equivalent for React components.

## Automatic detection

| Language | Tools and rules |
|---|---|
| Python | Pylint `R0902 too-many-instance-attributes`, `R0904 too-many-public-methods`; Ruff `PLR0904` (preview); size metrics with radon (`radon raw`, `radon mi`). |
| C# | SonarQube `S1448` (too many methods) and `S1200` (coupled to too many other classes); `CA1506` (excessive class coupling); NDepend with God Class rules. |
| React + TS | ESLint `max-lines`, `max-classes-per-file`; file-size metrics in SonarQube. |
| Go | golangci-lint `interfacebloat` (interfaces with too many methods), `maintidx`; review the number of methods per type and lines per file. |

## Implementations

Each folder contains the `smelly` version, the `refactored` version and the tests showing that both have the same observable behavior.

| Language | Folder |
|---|---|
| Python | [`python/code_smells/bloaters/large_class/`](../../../python/code_smells/bloaters/large_class/) |
| C# | [`csharp/src/CodeSmells/Bloaters/LargeClass/`](../../../csharp/src/CodeSmells/Bloaters/LargeClass/) |
| React + TS | [`react-ts/src/smells/bloaters/large-class/`](../../../react-ts/src/smells/bloaters/large-class/) |
| Go | [`go/smells/bloaters/large-class/`](../../../go/smells/bloaters/large-class/) |
| Angular | [`angular/src/smells/bloaters/large-class/`](../../../angular/src/smells/bloaters/large-class/) |

## References

- Fowler, M. (1999). *Refactoring: Improving the Design of Existing Code*. Addison-Wesley (chapter 3, "Bad Smells in Code", written with Kent Beck).
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.). Addison-Wesley. Refactoring catalog: https://refactoring.com/catalog/
- Mäntylä, M. V. and Lassenius, C. (2006). "Subjective evaluation of software evolvability using code smells: An empirical study". *Empirical Software Engineering*, 11(3), 395-431.
- Jerzyk, M. and Madeyski, L. (2023). *Code Smells: A Comprehensive Online Catalog and Taxonomy*. Online catalog: https://codesmells.org
- Riel, A. J. (1996). *Object-Oriented Design Heuristics*. Addison-Wesley.
- Refactoring.Guru — Large Class: https://refactoring.guru/smells/large-class
- Refactoring.Guru — Code Smells: https://refactoring.guru/refactoring/smells
- Fowler, M. — *CodeSmell* (bliki): https://martinfowler.com/bliki/CodeSmell.html
