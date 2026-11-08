# Exposing Mutable Collections

> **ID:** CS126 · **Category:** C#/.NET-specific · **Sources:** CA2227; Framework Design Guidelines

## Definition

A class exposes its internal collections as public properties of a mutable type (`List<T>`, arrays,
`Dictionary<,>`), often even with a public setter. Any client code can add, remove or replace items — or the whole
collection — without going through the class, which loses control over its invariants.

## Symptoms

- `public List<OrderLine> Lines { get; set; } = new();`.
- External code calling `order.Lines.Add(...)`, `order.Lines.Clear()` or `order.Lines = null`.
- Totals, counters or derived state that drift out of sync with the collection.
- Properties returning internal arrays (`public decimal[] Prices => _prices;`).

## Common causes

- Auto-generated properties out of habit or from templates.
- (Now obsolete) requirements of serializers and ORMs that needed public setters.
- Believing that `readonly` on the field or a getter without a setter makes the collection immutable.

## Why it is a problem

- **Broken invariants**: lines can be added to an order already shipped, or items duplicated.
- **Inconsistent state** between the collection and derived values (totals, caches, events).
- **Aliasing**: two objects share the same list and one modifies the other's.
- **`NullReferenceException`** if someone assigns `null` through the setter.
- Changing the internal type (from `List<T>` to `HashSet<T>`) breaks the public API.

## How it works under the hood

Collections are reference types: a getter returning the field hands out **the same instance**, so `readonly` or the
absence of a setter only prevents reassigning the reference, not modifying the contents. `IReadOnlyCollection<T>` /
`IReadOnlyList<T>` are read-only interfaces, but a client could cast back to `List<T>`; `List<T>.AsReadOnly()`
returns a `ReadOnlyCollection<T>`, a wrapper that throws `NotSupportedException` on modification and reflects
internal changes without copying. Immutable collections (`ImmutableArray<T>`, `FrozenSet<T>`) guarantee that nobody,
not even the class itself, changes them. Arrays are always mutable element by element. EF Core can map navigation
collections to private fields, so there is no need to expose the list.

## Example (smelly)

```csharp
public class ShoppingCart
{
    // SMELL: mutable list with a public setter
    public List<CartItem> Items { get; set; } = new();
    public decimal Total { get; private set; }

    public void Add(CartItem item)
    {
        Items.Add(item);
        Total += item.Price * item.Quantity;
    }
}

// Client: cart.Items.Add(new CartItem("KB-01", 49.9m, 2));  // Total is not updated
//         cart.Items = null;                                 // NullReferenceException later
```

## Solution (refactored)

```csharp
public class ShoppingCart
{
    private readonly List<CartItem> _items = new();

    // REFACTOR: read-only view; changes go through the class's methods
    public IReadOnlyList<CartItem> Items => _items.AsReadOnly();
    public decimal Total => _items.Sum(i => i.Price * i.Quantity);

    public void Add(CartItem item)
    {
        ArgumentNullException.ThrowIfNull(item);
        if (item.Quantity <= 0) throw new ArgumentOutOfRangeException(nameof(item));
        _items.Add(item);
    }

    public bool Remove(string sku) => _items.RemoveAll(i => i.Sku == sku) > 0;
}
```

## Recommended refactorings

- **Encapsulate Collection**: private field, read-only property and `Add`/`Remove` methods that enforce the rules.
- **Remove the setter** from collection properties (what `CA2227` asks for).
- **Expose read-only interfaces** (`IReadOnlyList<T>`, `IReadOnlyCollection<T>`) or `ReadOnlyCollection<T>` wrappers.
- **Use immutable collections** for data that does not change after construction.
- **Copy defensively** in the constructor when receiving an external collection.

## When it may be acceptable

- Serialization **DTOs** and ASP.NET binding models, whose only purpose is to carry data.
- Internal or private implementation types with no invariants to protect.
- Extreme performance scenarios where it is documented that the caller may fill a buffer.

## Related smells

- [Anemic Domain Model](anemic-domain-model.md)
- [Mutable Data](../06-data/mutable-data.md)
- [Too Much Information / Indecent Exposure](../11-general/too-much-information.md)
- [Inappropriate Intimacy](../05-couplers/inappropriate-intimacy.md)
- [Direct State Mutation (React + TS)](../16-react-ts/direct-state-mutation.md)

## Automatic detection

- **.NET analyzers**: `CA2227` (Collection properties should be read only), `CA1002` (Do not expose generic lists)
  and `CA1819` (Properties should not return arrays).
- **IDE0044** (Add readonly modifier) for the fields that hold the collection.

## Implementations

- C#: [`csharp/src/CodeSmells/CsharpSpecific/ExposedMutableCollections/`](../../../csharp/src/CodeSmells/CsharpSpecific/ExposedMutableCollections/)

C#/.NET-specific smell: there is no implementation in the other languages of the repository.

## References

- Microsoft Learn, CA2227: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca2227
- Microsoft Learn, CA1002: https://learn.microsoft.com/dotnet/fundamentals/code-analysis/quality-rules/ca1002
- Microsoft Learn, *Framework Design Guidelines — Guidelines for collections*:
  https://learn.microsoft.com/dotnet/standard/design-guidelines/guidelines-for-collections
- Krzysztof Cwalina, Jeremy Barton and Brad Abrams, *Framework Design Guidelines*, 3rd ed. (Addison-Wesley, 2020).
