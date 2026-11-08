namespace CodeSmells.Names.AmbiguousName.Refactored;

public sealed record Product(string Sku, int Stock, bool Discontinued);

public class Catalog
{
    // REFACTOR: Rename Method: "Exclude" makes it clear that items matching the predicate are dropped.
    public static List<Product> Exclude(IEnumerable<Product> products, Func<Product, bool> predicate) =>
        products.Where(p => !predicate(p)).ToList();

    // REFACTOR: Rename Method: the name tells exactly which transformation is applied.
    public static List<Product> DiscontinueOutOfStock(IEnumerable<Product> products) =>
        products.Select(p => p.Stock == 0 ? p with { Discontinued = true } : p).ToList();
}
