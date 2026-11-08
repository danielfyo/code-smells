using System.Diagnostics;
using CodeSmells.Tests.SlowTests.Refactored;

namespace CodeSmells.Tests.Tests.SlowTests;

// REFACTOR: an in-memory double removes the latency: tests are instant and deterministic.
public class RefactoredTests
{
    private sealed class InMemoryRateSource : IRateSource
    {
        public Task<decimal> GetRateAsync(string from, string to) =>
            Task.FromResult((from, to) == ("EUR", "USD") ? 1.08m : 0.93m);
    }

    private readonly CurrencyConverter _converter = new(new InMemoryRateSource());

    [Fact]
    public async Task Converts_eur_to_usd() =>
        Assert.Equal(108m, await _converter.ConvertAsync(100m, "EUR", "USD"));

    [Fact]
    public async Task Converts_usd_to_eur() =>
        Assert.Equal(93m, await _converter.ConvertAsync(100m, "USD", "EUR"));

    [Fact]
    public async Task Is_fast()
    {
        var stopwatch = Stopwatch.StartNew();
        await _converter.ConvertAsync(1m, "EUR", "USD");
        Assert.True(stopwatch.Elapsed < CodeSmells.Tests.SlowTests.Smelly.RemoteRateSource.SimulatedLatency);
    }
}
