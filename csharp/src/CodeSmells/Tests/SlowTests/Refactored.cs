namespace CodeSmells.Tests.SlowTests.Refactored;

// REFACTOR: the exchange-rate source is an injectable dependency; unit tests replace it
//           with an in-memory double and the remote version is left for a few integration tests.
public interface IRateSource
{
    Task<decimal> GetRateAsync(string from, string to);
}

public class CurrencyConverter(IRateSource source)
{
    public async Task<decimal> ConvertAsync(decimal amount, string from, string to) =>
        Math.Round(amount * await source.GetRateAsync(from, to), 2);
}
