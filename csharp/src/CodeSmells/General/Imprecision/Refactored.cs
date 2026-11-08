namespace CodeSmells.General.Imprecision.Refactored;

// REFACTOR: decimal for money amounts (base-10 arithmetic, exact for cents).
public sealed record Product(string Sku, string Name, decimal Price);

public class PriceList(IEnumerable<Product> products)
{
    public decimal Total(IEnumerable<string> skus) => skus.Sum(sku => FindBySku(sku).Price);

    // REFACTOR: the uniqueness assumption is stated (and checked), like Single does; errors are explicit.
    public Product FindBySku(string sku)
    {
        var matches = products.Where(p => p.Sku == sku).Take(2).ToList();
        return matches.Count switch
        {
            1 => matches[0],
            0 => throw new KeyNotFoundException($"Unknown SKU '{sku}'"),
            _ => throw new InvalidOperationException($"Duplicated SKU '{sku}' in price list"),
        };
    }

    public bool IsExactly(IEnumerable<string> skus, decimal expected) => Total(skus) == expected;
}
