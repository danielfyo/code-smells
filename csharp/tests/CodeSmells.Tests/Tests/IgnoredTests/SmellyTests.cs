using CodeSmells.Tests.IgnoredTests;

namespace CodeSmells.Tests.Tests.IgnoredTests;

public class SmellyTests
{
    [Fact]
    public void Welcome_coupon_gives_ten_percent()
    {
        var service = new CouponService(TimeProvider.System);
        Assert.Equal(90m, service.Apply("WELCOME10", 100m));
    }

    // SMELL: test disabled with a vague reason and no ticket or date. It stopped passing when the coupon
    //        expired (it uses the real clock) and instead of being fixed it was silenced. It has been yellow
    //        for months and nobody remembers what it protected: the expiry rule is no longer covered.
    [Fact(Skip = "Fails sometimes, will look at it later")]
    public void Summer_coupon_gives_twenty_percent()
    {
        var service = new CouponService(TimeProvider.System);
        Assert.Equal(80m, service.Apply("SUMMER24", 100m));
    }
}
