namespace CodeSmells.CsharpSpecific.LinqSideEffects.Smelly;

public sealed record Product(string Sku, int Stock);

public class LowStockAlerter
{
    public List<string> AlertsSent { get; } = new();

    // SMELL: side effects inside Select. LINQ is lazy: nothing runs until someone enumerates the result,
    //        and it runs AGAIN every time it is enumerated. Forget to enumerate and no alert is sent;
    //        call .Count() and then .ToList() and every alert is sent twice.
    public IEnumerable<string> FindLowStock(IEnumerable<Product> products) =>
        products
            .Where(p => p.Stock < 5)
            .Select(p =>
            {
                AlertsSent.Add($"Low stock: {p.Sku}");
                return p.Sku;
            });
}
