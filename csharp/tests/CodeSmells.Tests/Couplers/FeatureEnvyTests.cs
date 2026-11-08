using S = CodeSmells.Couplers.FeatureEnvy.Smelly;
using R = CodeSmells.Couplers.FeatureEnvy.Refactored;

namespace CodeSmells.Tests.Couplers;

public class FeatureEnvyTests
{
    [Theory]
    [InlineData(1, 100, false, 0)]
    [InlineData(6, 1500, false, 0)]
    [InlineData(6, 1500, false, 5)]
    [InlineData(1, 10, false, 9)]
    [InlineData(0, 0, true, 0)]
    public void Discounts_match(int years, int spent, bool employee, int returns)
    {
        var s = new S.Customer { Name = "C", YearsAsCustomer = years, SpentLastYear = spent, IsEmployee = employee, ReturnedOrders = returns };
        var r = new R.Customer("C", years, spent, employee, returns);
        Assert.Equal(new S.DiscountService().ApplyDiscount(s, 200m), new R.DiscountService().ApplyDiscount(r, 200m));
    }
}
