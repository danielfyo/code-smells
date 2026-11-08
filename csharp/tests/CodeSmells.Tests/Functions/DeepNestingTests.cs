using S = CodeSmells.Functions.DeepNesting.Smelly;
using R = CodeSmells.Functions.DeepNesting.Refactored;

namespace CodeSmells.Tests.Functions;

public class DeepNestingTests
{
    private static readonly HashSet<string> Served = ["ES", "PT", "FR"];

    [Theory]
    [InlineData(null, 2, "ES", true)]
    [InlineData("T1", 2, "ES", false)]
    [InlineData("T1", 0, "ES", true)]
    [InlineData("T1", 31, "ES", true)]
    [InlineData("T1", 2, "JP", true)]
    [InlineData("T1", 2, null, true)]
    [InlineData("T1", 2, "PT", true)]
    public void Guard_clauses_give_the_same_verdict(string? code, int kg, string? country, bool paid)
    {
        Assert.Equal(
            S.DispatchValidator.Validate(new S.Parcel(code, kg, country, paid), Served),
            R.DispatchValidator.Validate(new R.Parcel(code, kg, country, paid), Served));
    }
}
