using R = CodeSmells.ErrorHandling.IncorrectBoundaryBehavior.Refactored;
using S = CodeSmells.ErrorHandling.IncorrectBoundaryBehavior.Smelly;

namespace CodeSmells.Tests.ErrorHandling;

public class IncorrectBoundaryBehaviorTests
{
    private static List<S.Product> SItems(int n) => Enumerable.Range(1, n).Select(i => new S.Product($"P{i}", 4m)).ToList();
    private static List<R.Product> RItems(int n) => Enumerable.Range(1, n).Select(i => new R.Product($"P{i}", 4m)).ToList();

    [Fact]
    public void Smelly_first_page_skips_the_first_items()
    {
        Assert.Equal("P11", S.CatalogPaging.Page(SItems(21), 1, 10)[0].Name); // bug
        Assert.Equal("P1", R.CatalogPaging.Page(RItems(21), 1, 10)[0].Name);
    }

    [Fact]
    public void Smelly_total_pages_loses_the_last_partial_page()
    {
        Assert.Equal(2, S.CatalogPaging.TotalPages(21, 10)); // bug
        Assert.Equal(3, R.CatalogPaging.TotalPages(21, 10));
        Assert.Equal(0, R.CatalogPaging.TotalPages(0, 10));
        Assert.Single(R.CatalogPaging.Page(RItems(21), 3, 10));
    }

    [Fact]
    public void Empty_catalog_average()
    {
        Assert.Throws<DivideByZeroException>(() => S.CatalogPaging.AverageRating([]));
        Assert.Null(R.CatalogPaging.AverageRating([]));
        Assert.Equal(S.CatalogPaging.AverageRating(SItems(3)), R.CatalogPaging.AverageRating(RItems(3)));
    }

    [Fact]
    public void Refactored_rejects_invalid_arguments()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => R.CatalogPaging.Page(RItems(3), 0, 10));
        Assert.Throws<ArgumentOutOfRangeException>(() => R.CatalogPaging.TotalPages(3, 0));
    }
}
