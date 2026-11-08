using S = CodeSmells.Comments.PoorlyWrittenComment.Smelly;
using R = CodeSmells.Comments.PoorlyWrittenComment.Refactored;

namespace CodeSmells.Tests.Comments;

public class PoorlyWrittenCommentTests
{
    [Theory]
    [InlineData(50, 10, true, 50)]
    [InlineData(100, 0, false, 90)]
    [InlineData(100, 5, false, 85)]
    [InlineData(200, 1, true, 170)]
    public void Both_policies_apply_the_same_discount(decimal amount, int years, bool vip, decimal expected)
    {
        Assert.Equal(expected, new S.LoyaltyDiscountPolicy().Apply(amount, years, vip));
        Assert.Equal(expected, new R.LoyaltyDiscountPolicy().Apply(amount, years, vip));
    }
}
