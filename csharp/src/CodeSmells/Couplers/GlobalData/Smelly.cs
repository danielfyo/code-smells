namespace CodeSmells.Couplers.GlobalData.Smelly;

// SMELL: Global Data. Mutable configuration and state reachable from anywhere. Anyone can
// change the exchange rate or the counter and affect the whole system; tests contaminate
// each other and it is impossible to know who modified what.
public static class AppState
{
    public static decimal EurToUsdRate = 1.10m;
    public static int InvoicesIssued;
    public static string CompanyPrefix = "ACME";
}

public sealed class InvoiceIssuer
{
    public string Issue(decimal amountEur)
    {
        AppState.InvoicesIssued++;
        var usd = Math.Round(amountEur * AppState.EurToUsdRate, 2);
        return $"{AppState.CompanyPrefix}-{AppState.InvoicesIssued:D4}: {usd} USD";
    }
}

public sealed class TreasuryJob
{
    // SMELL: a faraway process changes the global value and silently alters the invoices.
    public void RefreshRates(decimal newRate) => AppState.EurToUsdRate = newRate;
}
