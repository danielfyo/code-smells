using S = CodeSmells.General.VerticalSeparation.Smelly;
using R = CodeSmells.General.VerticalSeparation.Refactored;

namespace CodeSmells.Tests.General;

public class VerticalSeparationTests
{
    [Theory]
    [InlineData("ES", 2, 10, 5.0)]
    [InlineData("IC", 2, 10, 16.0)]
    [InlineData("FR", 1, 10, 9.5)]
    [InlineData("ES", 5, 10, 0.0)]
    public void Both_quotes_are_equal(string country, int quantity, decimal unitPrice, decimal expected)
    {
        var smelly = new S.ShippingQuote().Calculate(new[] { new S.Line("SKU", quantity, unitPrice) }, country);
        var refactored = new R.ShippingQuote().Calculate(new[] { new R.Line("SKU", quantity, unitPrice) }, country);

        Assert.Equal(expected, smelly);
        Assert.Equal(smelly, refactored);
    }
}
