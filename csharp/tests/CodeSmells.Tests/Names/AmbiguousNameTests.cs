using R = CodeSmells.Names.AmbiguousName.Refactored;
using S = CodeSmells.Names.AmbiguousName.Smelly;

namespace CodeSmells.Tests.Names;

public class AmbiguousNameTests
{
    private static readonly (string Sku, int Stock)[] Data = { ("A", 0), ("B", 3), ("C", 0) };

    [Fact]
    public void Filter_and_Exclude_both_discard_matching_products()
    {
        var smelly = S.Catalog.Filter(Data.Select(d => new S.Product(d.Sku, d.Stock, false)), p => p.Stock == 0);
        var refactored = R.Catalog.Exclude(Data.Select(d => new R.Product(d.Sku, d.Stock, false)), p => p.Stock == 0);

        Assert.Equal(new[] { "B" }, smelly.Select(p => p.Sku));
        Assert.Equal(smelly.Select(p => p.Sku), refactored.Select(p => p.Sku));
    }

    [Fact]
    public void Process_and_DiscontinueOutOfStock_are_equivalent()
    {
        var smelly = S.Catalog.Process(Data.Select(d => new S.Product(d.Sku, d.Stock, false)));
        var refactored = R.Catalog.DiscontinueOutOfStock(Data.Select(d => new R.Product(d.Sku, d.Stock, false)));

        Assert.Equal(new[] { true, false, true }, smelly.Select(p => p.Discontinued));
        Assert.Equal(smelly.Select(p => p.Discontinued), refactored.Select(p => p.Discontinued));
    }
}
