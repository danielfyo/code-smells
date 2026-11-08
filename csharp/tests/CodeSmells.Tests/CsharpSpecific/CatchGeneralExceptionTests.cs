using R = CodeSmells.CsharpSpecific.CatchGeneralException.Refactored;
using S = CodeSmells.CsharpSpecific.CatchGeneralException.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class CatchGeneralExceptionTests
{
    [Theory]
    [InlineData("SAVE10", 90)]
    [InlineData(" vip25 ", 75)]
    [InlineData("UNKNOWN", 100)]
    public void Both_apply_the_same_discounts(string code, decimal expected)
    {
        Assert.Equal(expected, new S.CouponService().DiscountedPrice(100m, code));
        Assert.Equal(expected, new R.CouponService().DiscountedPrice(100m, code));
    }

    [Fact]
    public void Smelly_hides_a_programming_error_that_refactored_reports()
    {
        Assert.Equal(100m, new S.CouponService().DiscountedPrice(100m, null)); // the bug goes unnoticed
        Assert.Throws<ArgumentNullException>(() => new R.CouponService().DiscountedPrice(100m, null!));
    }
}
