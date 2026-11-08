using S = CodeSmells.Comments.CommentedOutCode.Smelly;
using R = CodeSmells.Comments.CommentedOutCode.Refactored;

namespace CodeSmells.Tests.Comments;

public class CommentedOutCodeTests
{
    [Theory]
    [InlineData(100, "ES", 121)]
    [InlineData(100, "PT", 123)]
    [InlineData(10.05, "FR", 12.06)]
    [InlineData(100, "US", 100)]
    public void Both_calculators_add_the_same_vat(decimal net, string country, decimal expected)
    {
        Assert.Equal(expected, new S.VatCalculator().AddVat(net, country));
        Assert.Equal(expected, new R.VatCalculator().AddVat(net, country));
    }
}
