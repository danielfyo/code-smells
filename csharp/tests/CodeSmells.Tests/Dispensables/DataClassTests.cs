using R = CodeSmells.Dispensables.DataClass.Refactored;
using S = CodeSmells.Dispensables.DataClass.Smelly;

namespace CodeSmells.Tests.Dispensables;

public class DataClassTests
{
    private static readonly DateOnly Start = new(2024, 1, 31);

    [Fact]
    public void Renew_and_upgrade_produce_same_state()
    {
        var s = new S.Subscription { CustomerId = "c1", MonthlyPrice = 9.99m, RenewsOn = Start };
        var svc = new S.SubscriptionService();
        svc.Renew(s); svc.Upgrade(s); svc.Upgrade(s);

        var r = new R.Subscription("c1", 9.99m, Start);
        r.Renew(); r.Upgrade(); r.Upgrade();

        Assert.Equal(s.RenewsOn, r.RenewsOn);
        Assert.Equal(s.MonthlyPrice, r.MonthlyPrice);
        Assert.Equal("premium", s.Plan);
        Assert.Equal(R.Plan.Premium, r.Plan);
    }

    [Fact]
    public void Cancelled_cannot_be_renewed()
    {
        var s = new S.Subscription { RenewsOn = Start };
        var svc = new S.SubscriptionService();
        svc.Cancel(s);
        Assert.Throws<InvalidOperationException>(() => svc.Renew(s));

        var r = new R.Subscription("c1", 1m, Start);
        r.Cancel();
        Assert.Throws<InvalidOperationException>(() => r.Renew());
    }

    [Fact]
    public void Data_class_lets_anyone_break_invariants()
    {
        var s = new S.Subscription { Plan = "premium", MonthlyPrice = -50m, Status = "whatever" };
        Assert.Equal(-50m, s.MonthlyPrice); // nothing prevents it
    }
}
