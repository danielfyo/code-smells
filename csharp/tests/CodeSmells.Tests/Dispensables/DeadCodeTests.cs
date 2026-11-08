using R = CodeSmells.Dispensables.DeadCode.Refactored;
using S = CodeSmells.Dispensables.DeadCode.Smelly;

namespace CodeSmells.Tests.Dispensables;

public class DeadCodeTests
{
    [Theory]
    [InlineData(99.9, "gold")]
    [InlineData(45.5, "silver")]
    [InlineData(12.0, "bronze")]
    public void Removing_dead_code_does_not_change_behavior(double amount, string tier)
    {
        var a = (decimal)amount;
        Assert.Equal(new S.LoyaltyPointsCalculator().PointsFor(a, tier, "web"), new R.LoyaltyPointsCalculator().PointsFor(a, tier));
    }
}
