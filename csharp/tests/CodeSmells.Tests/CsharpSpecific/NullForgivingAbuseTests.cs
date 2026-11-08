using R = CodeSmells.CsharpSpecific.NullForgivingAbuse.Refactored;
using S = CodeSmells.CsharpSpecific.NullForgivingAbuse.Smelly;

namespace CodeSmells.Tests.CsharpSpecific;

public class NullForgivingAbuseTests
{
    private static readonly (int Id, string Name, string? Email)[] Data =
    {
        (1, "Ana", " Ana@Shop.TEST "),
        (2, "Bob", null),
    };

    private static S.CustomerDirectory Smelly() => new(Data.Select(d => new S.Customer(d.Id, d.Name, d.Email)));
    private static R.CustomerDirectory Refactored() => new(Data.Select(d => new R.Customer(d.Id, d.Name, d.Email)));

    [Fact]
    public void Both_return_the_normalized_email_when_it_exists()
    {
        Assert.Equal("ana@shop.test", Smelly().GetContactEmail(1));
        Assert.Equal(Smelly().GetContactEmail(1), Refactored().FindContactEmail(1));
    }

    [Theory]
    [InlineData(2)]  // customer without email
    [InlineData(99)] // unknown customer
    public void Smelly_crashes_where_refactored_returns_null(int customerId)
    {
        Assert.Throws<NullReferenceException>(() => Smelly().GetContactEmail(customerId));
        Assert.Null(Refactored().FindContactEmail(customerId));
    }
}
