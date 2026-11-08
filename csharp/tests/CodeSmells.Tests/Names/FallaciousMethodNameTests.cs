using R = CodeSmells.Names.FallaciousMethodName.Refactored;
using S = CodeSmells.Names.FallaciousMethodName.Smelly;

namespace CodeSmells.Tests.Names;

public class FallaciousMethodNameTests
{
    [Fact]
    public void Smelly_IsValidEmail_mutates_the_subscriber()
    {
        var subscriber = new S.Subscriber("  Ana@Shop.TEST ");

        Assert.True(subscriber.IsValidEmail());
        Assert.Equal("ana@shop.test", subscriber.Email); // a "question" changed the state!
    }

    [Fact]
    public void Refactored_query_is_pure_and_normalization_is_explicit()
    {
        var subscriber = new R.Subscriber("  Ana@Shop.TEST ");

        Assert.True(subscriber.HasValidEmail());
        Assert.Equal("  Ana@Shop.TEST ", subscriber.Email);

        subscriber.NormalizeEmail();
        Assert.Equal("ana@shop.test", subscriber.Email);
    }

    [Fact]
    public void GetTotalPaid_actually_returns_the_average()
    {
        var smelly = new S.Subscriber("a@b.c");
        var refactored = new R.Subscriber("a@b.c");
        smelly.Payments.AddRange(new[] { 10m, 20m });
        refactored.Payments.AddRange(new[] { 10m, 20m });

        Assert.Equal(15m, smelly.GetTotalPaid()); // it is not the total (30)
        Assert.Equal(smelly.GetTotalPaid(), refactored.GetAveragePayment());
    }
}
