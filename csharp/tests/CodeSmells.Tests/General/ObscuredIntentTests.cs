using R = CodeSmells.General.ObscuredIntent.Refactored;
using S = CodeSmells.General.ObscuredIntent.Smelly;

namespace CodeSmells.Tests.General;

public class ObscuredIntentTests
{
    [Fact]
    public void Leap_year_rules_match_for_four_centuries()
    {
        for (var year = 1800; year <= 2400; year++)
        {
            Assert.Equal(DateTime.IsLeapYear(year), S.Billing.Leap(year));
            Assert.Equal(DateTime.IsLeapYear(year), R.Billing.IsLeapYear(year));
        }
    }

    [Theory]
    [InlineData(100, false, 0)]
    [InlineData(100, true, 0)]
    [InlineData(500, false, 40)]
    [InlineData(2000, true, 45)]
    public void Fees_match(decimal amount, bool premium, int days)
    {
        Assert.Equal(S.Billing.Fee(amount, premium, days), R.Billing.CalculateFee(amount, premium, days));
    }
}
