namespace CodeSmells.CsharpSpecific.ExposedMutableCollections.Refactored;

public sealed record OrderLine(string Sku, int Quantity, decimal UnitPrice);

public class Order
{
    public const int MaxLines = 3;

    // REFACTOR: Encapsulate Collection. The list is private and read-only (no setter); the outside
    //           world gets a read-only view, and changes only happen through methods that enforce the rules.
    private readonly List<OrderLine> _lines = new();

    public IReadOnlyList<OrderLine> Lines => _lines.AsReadOnly();

    public void AddLine(string sku, int quantity, decimal unitPrice)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);
        if (_lines.Count >= MaxLines)
        {
            throw new InvalidOperationException("Too many lines");
        }

        _lines.Add(new OrderLine(sku, quantity, unitPrice));
    }

    public bool RemoveLine(string sku) => _lines.RemoveAll(l => l.Sku == sku) > 0;

    public decimal Total => _lines.Sum(l => l.Quantity * l.UnitPrice);
}
