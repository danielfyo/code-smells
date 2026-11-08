using R = CodeSmells.ErrorHandling.ExceptionsForControlFlow.Refactored;
using S = CodeSmells.ErrorHandling.ExceptionsForControlFlow.Smelly;

namespace CodeSmells.Tests.ErrorHandling;

public class ExceptionsForControlFlowTests
{
    private static readonly string[] Lines = ["BOLT,10", "NUT,-3", "SCREW,5", "BOLT,abc", "garbage", "NUT,2"];

    [Fact]
    public void Both_apply_and_reject_the_same_lines()
    {
        var sStock = new Dictionary<string, int> { ["BOLT"] = 1, ["NUT"] = 10 };
        var rStock = new Dictionary<string, int> { ["BOLT"] = 1, ["NUT"] = 10 };
        var s = new S.StockImporter(sStock).Import(Lines);
        var r = new R.StockImporter(rStock).Import(Lines);
        Assert.Equal((3, 3), s);
        Assert.Equal(s, r);
        Assert.Equal(sStock, rStock);
    }
}
