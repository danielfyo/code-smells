using R = CodeSmells.Couplers.InsiderTrading.Refactored;
using S = CodeSmells.Couplers.InsiderTrading.Smelly;

namespace CodeSmells.Tests.Couplers;

public class InsiderTradingTests
{
    [Fact]
    public void Same_payments_and_points()
    {
        var sl = new S.LoyaltyProgram();
        var sc = new S.Checkout(sl);
        var rl = new R.LoyaltyProgram();
        var rc = new R.Checkout(rl);
        foreach (var amount in new[] { 600m, 500m, 200m })
        {
            Assert.Equal(sc.Pay("c1", amount), rc.Pay("c1", amount));
        }

        Assert.Equal(sl.PointsOf("c1"), rl.PointsOf("c1"));
        Assert.True(rl.IsGold("c1"));
    }
}
