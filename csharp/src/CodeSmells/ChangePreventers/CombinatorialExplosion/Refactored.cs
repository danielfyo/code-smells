namespace CodeSmells.ChangePreventers.CombinatorialExplosion.Refactored;

public sealed record Product(string Name, string Category, decimal Price, int Stock);

// REFACTOR: Parameterize Function + Introduce Parameter Object (specification). Filters are
// optional data combined freely; a new filter is one property and one line.
public sealed record ProductQuery(string? Category = null, decimal? MaxPrice = null, bool OnlyInStock = false)
{
    public bool Matches(Product p) =>
        (Category is null || p.Category == Category)
        && (MaxPrice is null || p.Price <= MaxPrice)
        && (!OnlyInStock || p.Stock > 0);
}

public sealed class ProductCatalog(IEnumerable<Product> products)
{
    private readonly List<Product> _products = products.ToList();

    public List<Product> Find(ProductQuery query) => _products.Where(query.Matches).ToList();
}
