using S = CodeSmells.Data.Loops.Smelly;
using R = CodeSmells.Data.Loops.Refactored;

namespace CodeSmells.Tests.Data;

public class LoopsTests
{
    private static readonly (string, string, decimal, bool)[] Data =
    [
        ("north", "ana", 100m, false), ("north", "bob", 300m, false), ("north", "ana", 250m, false),
        ("north", "carl", 999m, true), ("south", "dina", 5000m, false), ("north", "carl", 350m, false),
        ("north", "eve", 120m, false),
    ];

    [Theory]
    [InlineData("north", 2)]
    [InlineData("north", 10)]
    [InlineData("south", 1)]
    [InlineData("west", 3)]
    public void Pipeline_matches_loops(string region, int top)
    {
        var s = S.SalesStats.TopSellers(Data.Select(d => new S.Sale(d.Item1, d.Item2, d.Item3, d.Item4)).ToList(), region, top);
        var r = R.SalesStats.TopSellers(Data.Select(d => new R.Sale(d.Item1, d.Item2, d.Item3, d.Item4)), region, top);
        Assert.Equal(s, r);
    }
}
