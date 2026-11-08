namespace CodeSmells.CsharpSpecific.LinqSideEffects.Refactored;

public sealed record Product(string Sku, int Stock);

public class LowStockAlerter
{
    public List<string> AlertsSent { get; } = new();

    // REFACTOR: Separate Query from Modifier. The LINQ query is pure (no side effects) and materialized
    //           once; the side effect is an explicit loop in a method whose name says it sends alerts.
    public static IReadOnlyList<string> FindLowStock(IEnumerable<Product> products) =>
        products.Where(p => p.Stock < 5).Select(p => p.Sku).ToList();

    public IReadOnlyList<string> SendLowStockAlerts(IEnumerable<Product> products)
    {
        var lowStock = FindLowStock(products);
        foreach (var sku in lowStock)
        {
            AlertsSent.Add($"Low stock: {sku}");
        }
        return lowStock;
    }
}
