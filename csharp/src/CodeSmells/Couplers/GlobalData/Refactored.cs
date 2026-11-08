namespace CodeSmells.Couplers.GlobalData.Refactored;

// REFACTOR: Encapsulate Variable + Inject Dependency. State is no longer global: every
// dependency is passed explicitly, is immutable or has a single responsible owner.
public interface IExchangeRates { decimal EurToUsd { get; } }

public sealed record FixedRates(decimal EurToUsd) : IExchangeRates;

public sealed class InvoiceNumberSequence(string prefix)
{
    private int _last;
    public string Next() => $"{prefix}-{++_last:D4}";
}

public sealed class InvoiceIssuer(IExchangeRates rates, InvoiceNumberSequence numbers)
{
    public string Issue(decimal amountEur)
    {
        var usd = Math.Round(amountEur * rates.EurToUsd, 2);
        return $"{numbers.Next()}: {usd} USD";
    }
}
