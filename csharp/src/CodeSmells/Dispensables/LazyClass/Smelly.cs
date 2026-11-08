namespace CodeSmells.Dispensables.LazyClass.Smelly;

// SMELL: Lazy Class. Classes that do almost nothing: a one-line "formatter" and a "validator"
// that only wraps a comparison. Each one adds a file, a dependency and one more indirection for
// the reader to follow, without contributing anything.
public sealed class SkuFormatter
{
    public string Format(string sku) => sku.Trim().ToUpperInvariant();
}

public sealed class StockValidator
{
    public bool HasStock(int quantity) => quantity > 0;
}

public sealed class InventoryItem
{
    public string Sku { get; }
    public int Quantity { get; private set; }

    public InventoryItem(string sku, int quantity)
    {
        Sku = new SkuFormatter().Format(sku);
        Quantity = quantity;
    }

    public bool IsAvailable => new StockValidator().HasStock(Quantity);

    public void Remove(int units)
    {
        if (units > Quantity) throw new InvalidOperationException("Insufficient stock");
        Quantity -= units;
    }
}
