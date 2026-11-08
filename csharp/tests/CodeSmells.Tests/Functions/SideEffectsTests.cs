using R = CodeSmells.Functions.SideEffects.Refactored;
using S = CodeSmells.Functions.SideEffects.Smelly;

namespace CodeSmells.Tests.Functions;

public class SideEffectsTests
{
    [Fact]
    public void Smelly_query_discounts_every_time_it_is_asked()
    {
        var cart = new S.Cart { CustomerId = "c1", Total = 80m };
        var promos = new S.PromotionService();
        promos.IsEligibleForSummerPromo(cart); // to show a banner...
        promos.IsEligibleForSummerPromo(cart); // ...and again at checkout
        Assert.Equal(60m, cart.Total); // discounted twice!
    }

    [Fact]
    public void Refactored_query_is_pure_and_command_is_explicit()
    {
        var cart = new R.Cart { CustomerId = "c1", Total = 80m };
        var promos = new R.PromotionService();
        Assert.True(promos.IsEligibleForSummerPromo(cart));
        Assert.True(promos.IsEligibleForSummerPromo(cart));
        Assert.Equal(80m, cart.Total);

        promos.ApplySummerPromo(cart);
        promos.ApplySummerPromo(cart);
        Assert.Equal(70m, cart.Total);
        Assert.Single(promos.AuditLog);
    }

    [Fact]
    public void Single_use_gives_the_same_result()
    {
        var s = new S.Cart { CustomerId = "c", Total = 55m };
        new S.PromotionService().IsEligibleForSummerPromo(s);
        var r = new R.Cart { CustomerId = "c", Total = 55m };
        new R.PromotionService().ApplySummerPromo(r);
        Assert.Equal(s.Total, r.Total);
        Assert.Equal(s.AppliedPromotions, r.AppliedPromotions);
    }
}
