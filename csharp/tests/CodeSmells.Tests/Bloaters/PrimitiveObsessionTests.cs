using S = CodeSmells.Bloaters.PrimitiveObsession.Smelly;
using R = CodeSmells.Bloaters.PrimitiveObsession.Refactored;

namespace CodeSmells.Tests.Bloaters;

public class PrimitiveObsessionTests
{
    [Fact]
    public void Both_normalize_and_validate_emails()
    {
        var smelly = S.InvoiceOperations.Create("  Ana@Shop.COM ", 10m, "EUR");
        var email = new R.Email("  Ana@Shop.COM ");
        Assert.Equal(smelly.CustomerEmail, email.Value);
        Assert.Throws<ArgumentException>(() => S.InvoiceOperations.Create("nope", 1m, "EUR"));
        Assert.Throws<ArgumentException>(() => new R.Email("nope"));
    }

    [Fact]
    public void Same_currency_sums_match()
    {
        var s = S.InvoiceOperations.SumAmounts([
            S.InvoiceOperations.Create("a@b.c", 10m, "EUR"),
            S.InvoiceOperations.Create("a@b.c", 5.5m, "EUR")]);
        var r = R.InvoiceOperations.SumAmounts([
            new R.Invoice(new R.Email("a@b.c"), new R.Money(10m, R.Currency.Eur)),
            new R.Invoice(new R.Email("a@b.c"), new R.Money(5.5m, R.Currency.Eur))], R.Currency.Eur);
        Assert.Equal(s, r.Amount);
    }

    [Fact]
    public void Smelly_silently_mixes_currencies_while_refactored_refuses()
    {
        // Bug caused by the smell: 10 EUR + 10 USD = "20" with no unit.
        var s = S.InvoiceOperations.SumAmounts([
            S.InvoiceOperations.Create("a@b.c", 10m, "EUR"),
            S.InvoiceOperations.Create("a@b.c", 10m, "USD")]);
        Assert.Equal(20m, s);

        Assert.Throws<InvalidOperationException>(() => R.InvoiceOperations.SumAmounts([
            new R.Invoice(new R.Email("a@b.c"), new R.Money(10m, R.Currency.Eur)),
            new R.Invoice(new R.Email("a@b.c"), new R.Money(10m, R.Currency.Usd))], R.Currency.Eur));
    }
}
