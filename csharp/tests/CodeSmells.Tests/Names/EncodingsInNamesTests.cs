using S = CodeSmells.Names.EncodingsInNames.Smelly;
using R = CodeSmells.Names.EncodingsInNames.Refactored;

namespace CodeSmells.Tests.Names;

public class EncodingsInNamesTests
{
    [Fact]
    public void Both_customers_expose_the_same_data()
    {
        var smelly = new S.CCustomerClass("Ada", "Lovelace", true);
        var refactored = new R.Customer("Ada", "Lovelace", true);
        foreach (var amount in new[] { 10m, 25.5m })
        {
            smelly.AddOrderDecAmount(amount);
            refactored.AddOrder(amount);
        }

        Assert.Equal(smelly.GetStrFullName(), refactored.FullName);
        Assert.Equal(smelly.GetBIsActive(), refactored.IsActive);
        Assert.Equal(smelly.GetDecTotalSpent(), refactored.TotalSpent);
        Assert.Equal(smelly.GetIOrderCount(), refactored.OrderCount);
    }
}
