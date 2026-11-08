namespace CodeSmells.ChangePreventers.ShotgunSurgery.Refactored;

public sealed record Product(string Name, decimal NetPrice, bool IsFood);

// REFACTOR: Move Function / Combine Functions into Class. All the knowledge about VAT lives in
// a single place; changing a tax rate means editing one line.
public static class VatPolicy
{
    public const decimal General = 0.21m;
    public const decimal Reduced = 0.10m;

    public static decimal RateFor(Product p) => p.IsFood ? Reduced : General;
    public static decimal TaxOf(Product p) => p.NetPrice * RateFor(p);
    public static decimal GrossPrice(Product p) => p.NetPrice + TaxOf(p);
    public static int RatePercent(Product p) => (int)(RateFor(p) * 100);
}

public sealed class Cart
{
    public List<Product> Items { get; } = new();
    public decimal Total() => Items.Sum(VatPolicy.GrossPrice);
}

public sealed class InvoiceBuilder
{
    public decimal TaxAmount(IEnumerable<Product> items) => items.Sum(VatPolicy.TaxOf);
}

public sealed class ReceiptPrinter
{
    public string Line(Product p) => $"{p.Name} ({VatPolicy.RatePercent(p)}% VAT)";
}
