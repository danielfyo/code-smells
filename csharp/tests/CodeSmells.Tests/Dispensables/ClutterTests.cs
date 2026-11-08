using R = CodeSmells.Dispensables.Clutter.Refactored;
using S = CodeSmells.Dispensables.Clutter.Smelly;

namespace CodeSmells.Tests.Dispensables;

public class ClutterTests
{
    [Theory]
    [InlineData("ABCD1234", 10, true)]
    [InlineData("ABCD1234", -1, false)]
    [InlineData("ABC-1234", 10, false)]
    [InlineData("SHORT", 10, false)]
    public void Both_validate_identically(string code, int daysToExpiry, bool expected)
    {
        var today = new DateOnly(2024, 6, 1);
        var expires = today.AddDays(daysToExpiry);
        Assert.Equal(expected, new S.CouponValidator().IsValid(code, expires, today));
        Assert.Equal(expected, new R.CouponValidator().IsValid(code, expires, today));
    }
}
