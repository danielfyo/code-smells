using S = CodeSmells.CsharpSpecific.RegionAbuse.Smelly;
using R = CodeSmells.CsharpSpecific.RegionAbuse.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class RegionAbuseTests
{
    [Fact]
    public void Both_versions_register_customers_identically()
    {
        var smelly = new S.CustomerManager();
        var repository = new R.CustomerRepository();
        var mailer = new R.WelcomeMailer();
        var refactored = new R.RegisterCustomer(repository, new R.CustomerValidator(repository), mailer);

        var requests = new[]
        {
            ("Ana", "ana@shop.test", "ES"),
            ("Ana again", "ana@shop.test", "ES"),
            ("", "nobody@shop.test", "PT"),
            ("Bob", "bob-at-shop", "PT"),
            ("Joao", "joao@shop.test", "PT"),
        };

        foreach (var (name, email, country) in requests)
        {
            var expected = smelly.Register(name, email, country);
            var actual = refactored.Handle(name, email, country);
            Assert.Equal((expected.Success, expected.Message, expected.WelcomeDiscount), (actual.Success, actual.Message, actual.WelcomeDiscount));
        }

        Assert.Equal(smelly.SentEmails, mailer.SentEmails);
        Assert.Equal(2, mailer.SentEmails.Count);
    }
}
