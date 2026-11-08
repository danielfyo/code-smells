using R = CodeSmells.Names.UncommunicativeName.Refactored;
using S = CodeSmells.Names.UncommunicativeName.Smelly;

namespace CodeSmells.Tests.Names;

public class UncommunicativeNameTests
{
    [Fact]
    public void Both_versions_compute_the_same_total()
    {
        var raw = new List<decimal[]>
        {
            new[] { 10m, 2m, 0m },
            new[] { 5m, 0m, 0m },
            new[] { 20m, 1m, 0.25m },
        };
        var lines = raw.Select(x => new R.OrderLine(x[0], x[1], x[2]));

        var smelly = S.Proc.Calc(raw, 0.21m);
        var refactored = R.InvoiceCalculator.CalculateTotalWithTax(lines, 0.21m);

        Assert.Equal(42.35m, smelly);
        Assert.Equal(smelly, refactored);
    }
}
