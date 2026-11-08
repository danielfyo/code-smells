using S = CodeSmells.Bloaters.DataClumps.Smelly;
using R = CodeSmells.Bloaters.DataClumps.Refactored;

namespace CodeSmells.Tests.Bloaters;

public class DataClumpsTests
{
    [Theory]
    [InlineData("Gran Via 1", "Madrid", "28013", "ES", 2.0)]
    [InlineData("Calle Triana 5", "Las Palmas", "35002", "ES", 1.0)]
    [InlineData("Rua Augusta 10", "Lisboa", "1100-053", "pt", 3.5)]
    public void Both_versions_compute_same_label_and_cost(string street, string city, string zip, string country, double kg)
    {
        var weight = (decimal)kg;
        var smelly = new S.ShippingService();
        var refactored = new R.ShippingService();
        var address = new R.Address(street, city, zip, country);

        Assert.Equal(smelly.FormatLabel("Ana", street, city, zip, country), refactored.FormatLabel("Ana", address));
        Assert.Equal(smelly.ShippingCost(street, city, zip, country, weight), refactored.ShippingCost(address, weight));
    }
}
