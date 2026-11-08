namespace CodeSmells.CsharpSpecific.AnemicDomainModel.Refactored;

public enum OrderStatus { Draft, Shipped }

public sealed record OrderLine(string Sku, int Quantity, decimal UnitPrice)
{
    public decimal Subtotal => Quantity * UnitPrice;
}

// REFACTOR: rich domain model (Move Method into the entity + Encapsulate Field). The data and the rules
//           that protect it live together: the only way to change an order is through methods that
//           enforce its invariants, and derived data (Total) cannot get out of sync.
public class Order
{
    private readonly List<OrderLine> _lines = new();

    public IReadOnlyList<OrderLine> Lines => _lines;
    public OrderStatus Status { get; private set; } = OrderStatus.Draft;
    public decimal Total => _lines.Sum(l => l.Subtotal);

    public void AddLine(string sku, int quantity, decimal unitPrice)
    {
        if (Status != OrderStatus.Draft)
        {
            throw new InvalidOperationException("Order is not editable");
        }

        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);
        _lines.Add(new OrderLine(sku, quantity, unitPrice));
    }

    public void Ship()
    {
        if (_lines.Count == 0)
        {
            throw new InvalidOperationException("Cannot ship an empty order");
        }

        Status = OrderStatus.Shipped;
    }
}
