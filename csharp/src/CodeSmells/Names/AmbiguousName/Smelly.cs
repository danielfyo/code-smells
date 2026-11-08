namespace CodeSmells.Names.AmbiguousName.Smelly;

public sealed record Product(string Sku, int Stock, bool Discontinued);

public class Catalog
{
    // SMELL: "Filter" does not say whether it keeps or drops what matches the predicate.
    //        (Spoiler: here it DROPS them, exactly the opposite of LINQ Where.)
    public static List<Product> Filter(IEnumerable<Product> products, Func<Product, bool> predicate) =>
        products.Where(p => !predicate(p)).ToList();

    // SMELL: "Process" can mean anything. Does it validate? Save? Send?
    //        Here it actually marks out-of-stock products as discontinued.
    public static List<Product> Process(IEnumerable<Product> products) =>
        products.Select(p => p.Stock == 0 ? p with { Discontinued = true } : p).ToList();
}
