using CodeSmells.Tests.AssertionRoulette;

namespace CodeSmells.Tests.Tests.AssertionRoulette;

public class SmellyTests
{
    // SMELL: a pile of loose assertions with no message or name explaining them.
    //        When it fails, the report says "Assert.Equal() Failure: 2 != 3" and you have to go line by line
    //        to find out which field and which rule broke. Also, the first failure hides the rest.
    [Fact]
    public void Test1()
    {
        var line = InvoiceLineParser.Parse(" DSK-01 ; Standing desk ;2;150.50");

        Assert.Equal("DSK-01", line.Sku);
        Assert.Equal("Standing desk", line.Description);
        Assert.Equal(2, line.Quantity);
        Assert.Equal(150.50m, line.UnitPrice);
        Assert.Equal(301m, line.Total);
        Assert.True(line.Total > 0);
        Assert.NotNull(line);
    }
}
