using R = CodeSmells.ChangePreventers.CombinatorialExplosion.Refactored;
using S = CodeSmells.ChangePreventers.CombinatorialExplosion.Smelly;

namespace CodeSmells.Tests.ChangePreventers;

public class CombinatorialExplosionTests
{
    private static readonly (string, string, decimal, int)[] Data =
    [
        ("Drill", "tools", 59m, 3), ("Hammer", "tools", 12m, 0), ("Lamp", "home", 25m, 8), ("Sofa", "home", 499m, 1),
    ];

    private static readonly S.ProductCatalog Smelly = new(Data.Select(d => new S.Product(d.Item1, d.Item2, d.Item3, d.Item4)));
    private static readonly R.ProductCatalog Refactored = new(Data.Select(d => new R.Product(d.Item1, d.Item2, d.Item3, d.Item4)));

    private static IEnumerable<string> Names(IEnumerable<S.Product> ps) => ps.Select(p => p.Name);
    private static IEnumerable<string> Names(IEnumerable<R.Product> ps) => ps.Select(p => p.Name);

    [Fact]
    public void Every_combination_matches()
    {
        Assert.Equal(Names(Smelly.ByCategory("tools")), Names(Refactored.Find(new(Category: "tools"))));
        Assert.Equal(Names(Smelly.ByMaxPrice(50m)), Names(Refactored.Find(new(MaxPrice: 50m))));
        Assert.Equal(Names(Smelly.InStock()), Names(Refactored.Find(new(OnlyInStock: true))));
        Assert.Equal(Names(Smelly.ByCategoryAndMaxPrice("home", 100m)), Names(Refactored.Find(new("home", 100m))));
        Assert.Equal(Names(Smelly.ByCategoryInStock("tools")), Names(Refactored.Find(new("tools", OnlyInStock: true))));
        Assert.Equal(Names(Smelly.ByMaxPriceInStock(60m)), Names(Refactored.Find(new(MaxPrice: 60m, OnlyInStock: true))));
        Assert.Equal(Names(Smelly.ByCategoryAndMaxPriceInStock("tools", 20m)), Names(Refactored.Find(new("tools", 20m, true))));
    }
}
