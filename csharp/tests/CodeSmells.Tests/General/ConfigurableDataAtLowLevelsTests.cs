using S = CodeSmells.General.ConfigurableDataAtLowLevels.Smelly;
using R = CodeSmells.General.ConfigurableDataAtLowLevels.Refactored;

namespace CodeSmells.Tests.General;

public class ConfigurableDataAtLowLevelsTests
{
    [Theory]
    [InlineData("Madrid")]
    [InlineData("Sevilla")]
    public void Default_configuration_matches_the_buried_constants(string city)
    {
        Assert.Equal(
            new S.ShippingLabelPrinter().Print("A1", city),
            new R.ShippingLabelPrinter(new R.ShippingOptions()).Print("A1", city));
    }

    [Fact]
    public void Refactored_configuration_can_be_changed_from_the_top()
    {
        var options = new R.ShippingOptions { Origin = "Sevilla", Carriers = new[] { "GLS" } };
        var printer = new R.ShippingLabelPrinter(options);

        Assert.Equal("[A1] Sevilla - Courier local", printer.Print("A1", "Sevilla"));
        Assert.Equal("[A2] Madrid - GLS", printer.Print("A2", "Madrid"));
    }
}
