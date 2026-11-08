namespace CodeSmells.Couplers.InappropriateIntimacy.Refactored;

public enum OrderStatus { New, Backorder, Shipped }

public sealed record OrderLine(string Sku, int Quantity);

// REFACTOR: Encapsulate Field + Move Method + Change Bidirectional Association to Unidirectional.
// Each class protects its state and collaborates through methods with a clear intent.
public sealed class PurchaseOrder(IEnumerable<OrderLine> lines)
{
    private readonly List<OrderLine> _lines = lines.ToList();

    public IReadOnlyList<OrderLine> Lines => _lines;
    public OrderStatus Status { get; private set; } = OrderStatus.New;

    public void MarkShipped() => Status = OrderStatus.Shipped;
    public void MarkBackordered() => Status = OrderStatus.Backorder;
}

public sealed class Warehouse
{
    private readonly Dictionary<string, int> _stock = new();

    public void Receive(string sku, int quantity) => _stock[sku] = StockOf(sku) + quantity;
    public int StockOf(string sku) => _stock.GetValueOrDefault(sku);

    private bool CanServe(PurchaseOrder order) => order.Lines.All(l => StockOf(l.Sku) >= l.Quantity);

    public void Fulfill(PurchaseOrder order)
    {
        if (!CanServe(order))
        {
            order.MarkBackordered();
            return;
        }
        foreach (var line in order.Lines)
        {
            _stock[line.Sku] -= line.Quantity;
        }

        order.MarkShipped();
    }
}
