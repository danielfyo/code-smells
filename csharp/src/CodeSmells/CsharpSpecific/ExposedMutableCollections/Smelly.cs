namespace CodeSmells.CsharpSpecific.ExposedMutableCollections.Smelly;

public sealed record OrderLine(string Sku, int Quantity, decimal UnitPrice);

public class Order
{
    public const int MaxLines = 3;

    // SMELL: public List<T> with a public setter. AddLine enforces the rules (positive quantity, at most
    //        MaxLines lines), but any caller can skip it: order.Lines.Add(...), order.Lines.Clear(),
    //        or even order.Lines = null. The class can no longer guarantee its own invariants.
    public List<OrderLine> Lines { get; set; } = new();

    public void AddLine(string sku, int quantity, decimal unitPrice)
    {
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        if (Lines.Count >= MaxLines) throw new InvalidOperationException("Too many lines");
        Lines.Add(new OrderLine(sku, quantity, unitPrice));
    }

    public decimal Total => Lines.Sum(l => l.Quantity * l.UnitPrice);
}
