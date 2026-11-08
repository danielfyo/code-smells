using CodeSmells.Tests.MysteryGuest.Smelly;

namespace CodeSmells.Tests.Tests.MysteryGuest;

public class SmellyTests
{
    // SMELL: "mystery guest". Why is the price of LAMP 39.90? How many products are there?
    //        The answer is in a file you cannot see when reading the test (and that must be copied to the
    //        output directory from the .csproj). If someone edits it for another test, this one breaks.
    [Fact]
    public void Loads_price_list()
    {
        var prices = PriceListLoader.LoadFromFile(Path.Combine("Tests", "MysteryGuest", "Data", "prices.csv"));

        Assert.Equal(3, prices.Count);
        Assert.Equal(39.90m, prices["LAMP"]);
    }
}
