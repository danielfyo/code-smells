using R = CodeSmells.Comments.RedundantComment.Refactored;
using S = CodeSmells.Comments.RedundantComment.Smelly;

namespace CodeSmells.Tests.Comments;

public class RedundantCommentTests
{
    [Fact]
    public void Both_carts_compute_the_same_total_and_count()
    {
        var smelly = new S.ShoppingCart();
        var refactored = new R.ShoppingCart();
        foreach (var (sku, price, qty) in new[] { ("BOOK", 12.50m, 2), ("PEN", 1.20m, 5) })
        {
            smelly.Add(sku, price, qty);
            refactored.Add(sku, price, qty);
        }

        Assert.Equal(31.00m, smelly.Total());
        Assert.Equal(smelly.Total(), refactored.Total());
        Assert.Equal(7, smelly.Count);
        Assert.Equal(smelly.Count, refactored.Count);
    }

    [Fact]
    public void Empty_cart_totals_zero()
    {
        Assert.Equal(0m, new S.ShoppingCart().Total());
        Assert.Equal(0m, new R.ShoppingCart().Total());
    }
}
