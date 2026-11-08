using S = CodeSmells.Functions.CommandQueryViolation.Smelly;
using R = CodeSmells.Functions.CommandQueryViolation.Refactored;

namespace CodeSmells.Tests.Functions;

public class CommandQueryViolationTests
{
    [Fact]
    public void Asking_twice_consumes_the_card_in_smelly()
    {
        var s = new S.GiftCardRegistry();
        s.Issue("GC1", 30m);
        var preview = s.Redeem("GC1", 50m);   // we only wanted to show how much it covers
        var atCheckout = s.Redeem("GC1", 50m);
        Assert.Equal((30m, 0m), (preview, atCheckout));
    }

    [Fact]
    public void Refactored_query_is_repeatable_and_charge_is_explicit()
    {
        var r = new R.GiftCardRegistry();
        r.Issue("GC1", 30m);
        Assert.Equal(30m, r.CoverageFor("GC1", 50m));
        Assert.Equal(30m, r.CoverageFor("GC1", 50m));
        r.Charge("GC1", r.CoverageFor("GC1", 50m));
        Assert.Equal(0m, r.BalanceOf("GC1"));
    }

    [Fact]
    public void Single_redeem_equals_coverage_plus_charge()
    {
        var s = new S.GiftCardRegistry(); s.Issue("GC", 100m);
        var r = new R.GiftCardRegistry(); r.Issue("GC", 100m);
        var used = s.Redeem("GC", 40m);
        var coverage = r.CoverageFor("GC", 40m);
        r.Charge("GC", coverage);
        Assert.Equal(used, coverage);
        Assert.Equal(s.BalanceOf("GC"), r.BalanceOf("GC"));
    }
}
