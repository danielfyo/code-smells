namespace CodeSmells.ChangePreventers.ShotgunSurgery.Smelly;

// SMELL: Shotgun Surgery. The rule "21% standard VAT and 10% reduced VAT for food" is spread
// across three classes. If the government changes the rate, every occurrence has to be found and
// edited; forgetting one produces inconsistent amounts between cart, invoice and receipt.

public sealed record Product(string Name, decimal NetPrice, bool IsFood);

public sealed class Cart
{
    public List<Product> Items { get; } = new();
    public decimal Total() => Items.Sum(p => p.NetPrice * (p.IsFood ? 1.10m : 1.21m));
}

public sealed class InvoiceBuilder
{
    public decimal TaxAmount(IEnumerable<Product> items) =>
        items.Sum(p => p.NetPrice * (p.IsFood ? 0.10m : 0.21m));
}

public sealed class ReceiptPrinter
{
    public string Line(Product p)
    {
        var rate = p.IsFood ? 10 : 21;
        return $"{p.Name} ({rate}% VAT)";
    }
}
