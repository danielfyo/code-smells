using S = CodeSmells.Couplers.GlobalData.Smelly;
using R = CodeSmells.Couplers.GlobalData.Refactored;

namespace CodeSmells.Tests.Couplers;

public class GlobalDataTests
{
    [Fact]
    public void Smelly_output_depends_on_hidden_global_state()
    {
        // Global state must be reset by hand: if another test touches it, this one fails.
        S.AppState.EurToUsdRate = 1.10m;
        S.AppState.InvoicesIssued = 0;
        var issuer = new S.InvoiceIssuer();
        var first = issuer.Issue(100m);

        new S.TreasuryJob().RefreshRates(2m); // someone far away changes the global value
        var second = issuer.Issue(100m);

        var r = new R.InvoiceIssuer(new R.FixedRates(1.10m), new R.InvoiceNumberSequence("ACME"));
        Assert.Equal(first, r.Issue(100m));
        Assert.NotEqual(second.Split(':')[1], r.Issue(100m).Split(':')[1]); // the global change "leaked in"

        S.AppState.EurToUsdRate = 1.10m;
        S.AppState.InvoicesIssued = 0;
    }

    [Fact]
    public void Refactored_issuers_are_independent()
    {
        var a = new R.InvoiceIssuer(new R.FixedRates(1m), new R.InvoiceNumberSequence("A"));
        var b = new R.InvoiceIssuer(new R.FixedRates(1m), new R.InvoiceNumberSequence("B"));
        a.Issue(1m);
        Assert.StartsWith("B-0001", b.Issue(1m));
        Assert.StartsWith("A-0002", a.Issue(1m));
    }
}
