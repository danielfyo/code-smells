using CodeSmells.Tests.SlowTests.Smelly;

namespace CodeSmells.Tests.Tests.SlowTests;

// SMELL: every test waits for the "network". Here it is ~150 ms per call; in a real project it is seconds,
//        multiplied by hundreds of tests: the suite takes so long that nobody runs it before pushing.
public class SmellyTests
{
    [Fact]
    public async Task Converts_eur_to_usd() =>
        Assert.Equal(108m, await new CurrencyConverter().ConvertAsync(100m, "EUR", "USD"));

    [Fact]
    public async Task Converts_usd_to_eur() =>
        Assert.Equal(93m, await new CurrencyConverter().ConvertAsync(100m, "USD", "EUR"));
}
