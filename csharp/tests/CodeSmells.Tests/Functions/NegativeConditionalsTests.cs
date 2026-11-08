using S = CodeSmells.Functions.NegativeConditionals.Smelly;
using R = CodeSmells.Functions.NegativeConditionals.Refactored;

namespace CodeSmells.Tests.Functions;

public class NegativeConditionalsTests
{
    [Theory]
    [InlineData(100, false, true)]
    [InlineData(800, false, true)]
    [InlineData(100, true, true)]
    [InlineData(100, false, false)]
    [InlineData(730, false, true)]
    public void Positive_conditions_give_the_same_verdict(int daysSincePurchase, bool damaged, bool receipt)
    {
        var today = new DateOnly(2024, 6, 1);
        var purchase = today.AddDays(-daysSincePurchase);
        var s = new S.WarrantyClaim { PurchaseDate = purchase, IsNotDamagedByUser = !damaged, HasNoReceipt = !receipt };
        var r = new R.WarrantyClaim(purchase, damaged, receipt);
        Assert.Equal(S.WarrantyDesk.Review(s, today), R.WarrantyDesk.Review(r, today));
    }
}
