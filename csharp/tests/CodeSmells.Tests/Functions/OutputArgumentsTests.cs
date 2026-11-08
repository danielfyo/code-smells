using S = CodeSmells.Functions.OutputArguments.Smelly;
using R = CodeSmells.Functions.OutputArguments.Refactored;

namespace CodeSmells.Tests.Functions;

public class OutputArgumentsTests
{
    [Fact]
    public void Return_value_carries_the_same_information()
    {
        var warnings = new List<string>();
        S.CartPricing.Calculate([new("TSHIRT", 3, 12m, 5), new("CAP", 4, 8m, 2)], out var subtotal, out var units, warnings);

        var summary = R.CartPricing.Calculate([new("TSHIRT", 3, 12m, 5), new("CAP", 4, 8m, 2)]);

        Assert.Equal(subtotal, summary.Subtotal);
        Assert.Equal(units, summary.Units);
        Assert.Equal(warnings, summary.Warnings);
    }

    [Fact]
    public void Smelly_accumulates_into_the_callers_list()
    {
        var warnings = new List<string>();
        S.CartPricing.Calculate([new("CAP", 4, 8m, 2)], out _, out _, warnings);
        S.CartPricing.Calculate([new("CAP", 4, 8m, 2)], out _, out _, warnings);
        Assert.Equal(2, warnings.Count); // reusing the list mixes the results of two calls
        Assert.Single(R.CartPricing.Calculate([new("CAP", 4, 8m, 2)]).Warnings);
    }
}
