using R = CodeSmells.Dispensables.SpeculativeGenerality.Refactored;
using S = CodeSmells.Dispensables.SpeculativeGenerality.Smelly;

namespace CodeSmells.Tests.Dispensables;

public class SpeculativeGeneralityTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(2.5)]
    [InlineData(10)]
    public void Simple_function_matches_the_generic_machinery(double kg)
    {
        var w = (decimal)kg;
        Assert.Equal(S.PricingStrategyFactory.Create().Calculate(new S.Parcel(w)), R.ParcelPricing.Price(new R.Parcel(w)));
    }
}
