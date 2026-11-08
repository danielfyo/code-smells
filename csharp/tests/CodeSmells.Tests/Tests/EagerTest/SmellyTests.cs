using CodeSmells.Tests.EagerTest;

namespace CodeSmells.Tests.Tests.EagerTest;

public class SmellyTests
{
    // SMELL: a single "eager" test exercises adding, grouping, removing, coupons, errors and totals.
    //        Its name cannot describe what it verifies, when it fails nobody knows which behaviour broke,
    //        and an early failure prevents checking the rest.
    [Fact]
    public void Cart_works()
    {
        var cart = new ShoppingCart();
        cart.Add("BOOK", 20m);
        cart.Add("BOOK", 20m);
        cart.Add("PEN", 2m, 5);
        Assert.Equal(7, cart.ItemCount);
        Assert.Equal(50m, cart.Total());

        cart.Remove("PEN");
        Assert.Equal(2, cart.ItemCount);

        cart.ApplyCoupon("SAVE10");
        Assert.Equal(36m, cart.Total());

        Assert.Throws<ArgumentException>(() => cart.ApplyCoupon("FREE"));
        Assert.Throws<ArgumentOutOfRangeException>(() => cart.Add("PEN", 2m, 0));
    }
}
