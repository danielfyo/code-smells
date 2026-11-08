namespace CodeSmells.Tests.SlowTests.Smelly;

// SMELL: the service creates its own remote data source (simulated here with a network delay),
//        so every test that uses it pays the real latency. See tests/.../Tests/SlowTests/SmellyTests.cs.
public class RemoteRateSource
{
    public static readonly TimeSpan SimulatedLatency = TimeSpan.FromMilliseconds(150);

    public async Task<decimal> GetRateAsync(string from, string to)
    {
        await Task.Delay(SimulatedLatency); // simulates an HTTP call to an external provider
        return (from, to) switch
        {
            ("EUR", "USD") => 1.08m,
            ("USD", "EUR") => 0.93m,
            _ => 1m,
        };
    }
}

public class CurrencyConverter
{
    private readonly RemoteRateSource _source = new();

    public async Task<decimal> ConvertAsync(decimal amount, string from, string to) =>
        Math.Round(amount * await _source.GetRateAsync(from, to), 2);
}
