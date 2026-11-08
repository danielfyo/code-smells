namespace CodeSmells.Couplers.InappropriateIntimacy.Smelly;

// SMELL: Inappropriate Intimacy. Warehouse and PurchaseOrder poke into each other's guts:
// the warehouse directly manipulates the order's internal line list and its status,
// and the order reads the warehouse's stock dictionary. Neither can change its internal
// representation without breaking the other.
public sealed class PurchaseOrder
{
    public List<(string Sku, int Qty)> InternalLines = new();
    public string StatusCode = "NEW";
    public Warehouse? AssignedWarehouse;

    public bool CanBeFulfilled() =>
        InternalLines.All(l => AssignedWarehouse!.StockBySku.GetValueOrDefault(l.Sku) >= l.Qty);
}

public sealed class Warehouse
{
    public Dictionary<string, int> StockBySku = new();

    public void Fulfill(PurchaseOrder order)
    {
        order.AssignedWarehouse = this;
        if (!order.CanBeFulfilled())
        {
            order.StatusCode = "BACKORDER";
            return;
        }
        foreach (var (sku, qty) in order.InternalLines)
            StockBySku[sku] -= qty;
        order.InternalLines.Clear(); // SMELL: wipes data it does not own
        order.StatusCode = "SHIPPED";
    }
}
