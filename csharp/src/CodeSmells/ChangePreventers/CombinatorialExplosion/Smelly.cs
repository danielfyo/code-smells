namespace CodeSmells.ChangePreventers.CombinatorialExplosion.Smelly;

public sealed record Product(string Name, string Category, decimal Price, int Stock);

public sealed class ProductCatalog(IEnumerable<Product> products)
{
    private readonly List<Product> _products = products.ToList();

    // SMELL: Combinatorial Explosion. One method per combination of filters. With 3 filters there
    // are already 7 almost identical variants; adding a fourth filter (brand) would double them.
    public List<Product> ByCategory(string category) =>
        _products.Where(p => p.Category == category).ToList();

    public List<Product> ByMaxPrice(decimal maxPrice) =>
        _products.Where(p => p.Price <= maxPrice).ToList();

    public List<Product> InStock() =>
        _products.Where(p => p.Stock > 0).ToList();

    public List<Product> ByCategoryAndMaxPrice(string category, decimal maxPrice) =>
        _products.Where(p => p.Category == category && p.Price <= maxPrice).ToList();

    public List<Product> ByCategoryInStock(string category) =>
        _products.Where(p => p.Category == category && p.Stock > 0).ToList();

    public List<Product> ByMaxPriceInStock(decimal maxPrice) =>
        _products.Where(p => p.Price <= maxPrice && p.Stock > 0).ToList();

    public List<Product> ByCategoryAndMaxPriceInStock(string category, decimal maxPrice) =>
        _products.Where(p => p.Category == category && p.Price <= maxPrice && p.Stock > 0).ToList();
}
