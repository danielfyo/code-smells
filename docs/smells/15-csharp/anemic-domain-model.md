# Anemic Domain Model

> **ID:** CS124 · **Category:** C#/.NET-specific · **Sources:** Fowler 2003

## Definition

Domain entities (`Order`, `Invoice`, `Account`) are mere data holders with public `get; set;` properties and no
behaviour, while all business logic lives in "services" that read and modify those properties from the outside. It
looks like an object-oriented model, but it is really procedural design: data on one side, functions on the other,
and no object protecting its invariants.

## Symptoms

- Entities where every property has `public set;` and there are no methods.
- `OrderService`, `OrderManager`, `OrderHelper` classes with dozens of methods manipulating `Order`.
- The same validation (`if (order.Status == "Shipped") throw ...`) repeated across several services.
- An entity can be put in an invalid state with a simple assignment (`order.Total = -5`).

## Common causes

- Layered-architecture templates applied mechanically ("entities are DTOs").
- ORMs and serializers that, in older versions, required public setters and parameterless constructors.
- Confusing domain entities with transfer or persistence models.

## Why it is a problem

- **Unprotected invariants**: any code can leave the object in an inconsistent state.
- **Duplicated, scattered logic** across services.
- **Feature envy**: services know and manipulate the internals of entities.
- **Costly changes**: a new business rule means hunting down every service that touches the entity.

## How it works under the hood

C# offers tools that let an entity control its own state: `private` or `init` setters, `required` properties,
collections exposed as `IReadOnlyCollection<T>`, validating constructors and methods that express business
operations. EF Core can materialize entities through parameterized constructors and by assigning **private fields**
(backing fields), so public setters and public parameterless constructors are no longer needed for persistence; it
also supports owned types and value conversions for value objects. `record` types are useful for immutable value
objects with structural equality.

## Example (smelly)

```csharp
public class Order   // SMELL: data only; anyone can break the invariants
{
    public int Id { get; set; }
    public string Status { get; set; } = "Draft";
    public List<OrderLine> Lines { get; set; } = new();
    public decimal Total { get; set; }
}

public class OrderService
{
    public void AddLine(Order order, string sku, int qty, decimal price)
    {
        if (order.Status != "Draft") throw new InvalidOperationException("Order is closed");
        order.Lines.Add(new OrderLine { Sku = sku, Quantity = qty, UnitPrice = price });
        order.Total = order.Lines.Sum(l => l.Quantity * l.UnitPrice);   // and if someone forgets...
    }
}
```

## Solution (refactored)

```csharp
public class Order
{
    private readonly List<OrderLine> _lines = new();

    public int Id { get; private set; }
    public OrderStatus Status { get; private set; } = OrderStatus.Draft;
    public IReadOnlyCollection<OrderLine> Lines => _lines.AsReadOnly();
    public decimal Total => _lines.Sum(l => l.Subtotal);   // REFACTOR: derived, never out of sync

    // REFACTOR: behaviour lives with the data and protects the invariants
    public void AddLine(string sku, int quantity, decimal unitPrice)
    {
        if (Status != OrderStatus.Draft) throw new InvalidOperationException("Order is closed");
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        _lines.Add(new OrderLine(sku, quantity, unitPrice));
    }

    public void Confirm() => Status = _lines.Count > 0
        ? OrderStatus.Confirmed
        : throw new InvalidOperationException("Order is empty");
}
```

## Recommended refactorings

- **Move Method**: move logic from services into the entity that owns the data.
- **Encapsulate Field / Encapsulate Collection**: private setters, read-only collections.
- **Replace Primitive with Object**: value objects (`Money`, `Email`, `OrderStatus`) that validate themselves.
- **Constructors that enforce invariants** instead of empty constructors followed by assignments.
- Leave only **orchestration** in application services (load, call the domain, save).

## When it may be acceptable

- **DTOs**, view models and API contracts: their purpose is to carry data, not behaviour.
- CRUD applications with no meaningful business rules, where a rich model would be speculative generality.
- Functional architectures that deliberately separate immutable data from pure functions, with types that make
  invalid states unrepresentable.

## Related smells

- [Data Class](../04-dispensables/data-class.md)
- [Feature Envy](../05-couplers/feature-envy.md)
- [Exposing Mutable Collections](exposed-mutable-collections.md)
- [Primitive Obsession](../01-bloaters/primitive-obsession.md)
- [Business Logic in Components (React + TS)](../16-react-ts/business-logic-in-components.md)

## Automatic detection

No compiler rule detects an anemic model. `CA2227` (setters on collection properties) helps, as do metrics such as
the ratio of properties to methods or "feature envy" detection in tools like NDepend, and architecture tests
(NetArchTest, ArchUnitNET) that forbid public setters in the domain project.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/AnemicDomainModel/`](../../../csharp/src/CodeSmells/CsharpSpecific/AnemicDomainModel/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Martin Fowler, *AnemicDomainModel* (2003): https://martinfowler.com/bliki/AnemicDomainModel.html
- Microsoft Learn, *Design a microservice domain model*:
  https://learn.microsoft.com/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-domain-model
- Microsoft Learn, *Backing fields* (EF Core): https://learn.microsoft.com/ef/core/modeling/backing-field
- Eric Evans, *Domain-Driven Design: Tackling Complexity in the Heart of Software* (Addison-Wesley, 2003).
