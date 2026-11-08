namespace CodeSmells.General.Imprecision.Smelly;

public sealed record Product(string Sku, string Name, double Price);

public class PriceList(IEnumerable<Product> products)
{
    // SMELL: double for money. 0.1 + 0.2 is not 0.3 in binary; cents get lost or appear out of nowhere.
    public double Total(IEnumerable<string> skus) => skus.Sum(sku => FindBySku(sku).Price);

    // SMELL: First() assumes the SKU is unique without checking: with duplicates it silently returns
    //        "any one of them", and if it is missing it throws a generic InvalidOperationException.
    public Product FindBySku(string sku) => products.First(p => p.Sku == sku);

    // SMELL: comparing money as double with == is imprecise by definition.
    public bool IsExactly(IEnumerable<string> skus, double expected) => Total(skus) == expected;
}
