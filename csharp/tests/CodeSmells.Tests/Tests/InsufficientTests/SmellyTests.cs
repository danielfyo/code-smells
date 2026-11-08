using CodeSmells.Tests.InsufficientTests;

namespace CodeSmells.Tests.Tests.InsufficientTests;

// SMELL: a single happy-path test. Free shipping, the weight surcharge, the other zones
//        and the errors are not tested. Real rule coverage is minimal and nobody measures it.
public class SmellyTests
{
    [Fact]
    public void Calculates_shipping()
    {
        Assert.Equal(4.95m, ShippingCostCalculator.Calculate(1m, 20m, "peninsula"));
    }
}
