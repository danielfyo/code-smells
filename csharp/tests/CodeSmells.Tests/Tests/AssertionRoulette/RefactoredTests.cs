using CodeSmells.Tests.AssertionRoulette;

namespace CodeSmells.Tests.Tests.AssertionRoulette;

// REFACTOR: each test has a name that describes the rule, and the whole object is compared
//           (record equality): on failure, xUnit shows the full expected and actual values.
//           When several checks are needed, Assert.Multiple reports ALL the failing ones.
public class RefactoredTests
{
    [Fact]
    public void Parses_all_fields_trimming_spaces()
    {
        var expected = new InvoiceLine("DSK-01", "Standing desk", 2, 150.50m, 301m);

        Assert.Equal(expected, InvoiceLineParser.Parse(" DSK-01 ; Standing desk ;2;150.50"));
    }

    [Fact]
    public void Total_is_quantity_times_unit_price()
    {
        var line = InvoiceLineParser.Parse("PEN;Pen;3;1.25");

        Assert.Multiple(
            () => Assert.Equal(3, line.Quantity),
            () => Assert.Equal(1.25m, line.UnitPrice),
            () => Assert.Equal(3.75m, line.Total));
    }
}
