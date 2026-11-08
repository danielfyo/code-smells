using CodeSmells.Tests.MysteryGuest.Refactored;

namespace CodeSmells.Tests.Tests.MysteryGuest;

// REFACTOR: Inline Resource: the data that matters for the test is in the test itself.
//           Cause and effect are read together and no other test can alter them.
public class RefactoredTests
{
    [Fact]
    public void Parses_one_entry_per_line_after_the_header()
    {
        const string csv = """
            sku,price
            DSK-01,150.50
            PEN,1.25
            LAMP,39.90
            """;

        var prices = PriceListLoader.Parse(new StringReader(csv));

        Assert.Equal(3, prices.Count);
        Assert.Equal(39.90m, prices["LAMP"]);
    }
}
