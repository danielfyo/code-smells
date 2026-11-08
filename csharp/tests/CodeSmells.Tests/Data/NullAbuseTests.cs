using S = CodeSmells.Data.NullAbuse.Smelly;
using R = CodeSmells.Data.NullAbuse.Refactored;

namespace CodeSmells.Tests.Data;

public class NullAbuseTests
{
    private static (S.GreetingService, R.GreetingService) Build()
    {
        var sRepo = new S.CustomerRepository();
        sRepo.Add(new S.Customer { Id = "c1", Name = "Marta", Orders = ["o1", "o2"], Coupon = "BF24" });
        sRepo.Add(new S.Customer { Id = "c2", Name = "Pablo", Orders = [] });
        var rRepo = new R.CustomerRepository();
        rRepo.Add(new R.Customer("c1", "Marta", ["o1", "o2"], "BF24"));
        rRepo.Add(new R.Customer("c2", "Pablo", []));
        return (new S.GreetingService(sRepo), new R.GreetingService(rRepo));
    }

    [Theory]
    [InlineData("c1")]
    [InlineData("c2")]
    [InlineData("unknown")]
    public void Greetings_match(string id)
    {
        var (s, r) = Build();
        Assert.Equal(s.Greeting(id), r.Greeting(id));
    }

    [Fact]
    public void Smelly_crashes_for_unknown_customer_refactored_returns_zero()
    {
        var (s, r) = Build();
        Assert.Throws<NullReferenceException>(() => s.OrderCount("unknown"));
        Assert.Equal(0, r.OrderCount("unknown"));
    }
}
