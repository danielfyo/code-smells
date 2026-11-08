namespace CodeSmells.Dispensables.LazyClass.Refactored;

// REFACTOR: Inline Class. The trivial logic goes back into the class that uses it; two types
// that did not justify their existence disappear.
public sealed class InventoryItem(string sku, int quantity)
{
    public string Sku { get; } = sku.Trim().ToUpperInvariant();
    public int Quantity { get; private set; } = quantity;

    public bool IsAvailable => Quantity > 0;

    public void Remove(int units)
    {
        if (units > Quantity)
        {
            throw new InvalidOperationException("Insufficient stock");
        }

        Quantity -= units;
    }
}
