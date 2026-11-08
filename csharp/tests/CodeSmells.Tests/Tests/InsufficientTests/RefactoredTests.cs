using CodeSmells.Tests.InsufficientTests;

namespace CodeSmells.Tests.Tests.InsufficientTests;

// REFACTOR: every business rule and every error path is covered. A coverage tool
//           (coverlet is already referenced: `dotnet test --collect:"XPlat Code Coverage"`) confirms
//           that no branch is left untested.
public class RefactoredTests
{
    [Theory]
    [InlineData(1, 20, "peninsula", 4.95)]
    [InlineData(1, 20, "islands", 12.50)]
    [InlineData(1, 20, "international", 25)]
    public void Base_cost_depends_on_zone(decimal kg, decimal total, string zone, decimal expected) =>
        Assert.Equal(expected, ShippingCostCalculator.Calculate(kg, total, zone));

    [Fact]
    public void Peninsula_orders_from_threshold_ship_for_free() =>
        Assert.Equal(0m, ShippingCostCalculator.Calculate(10m, ShippingCostCalculator.FreeShippingFrom, "peninsula"));

    [Fact]
    public void Free_shipping_does_not_apply_to_islands() =>
        Assert.Equal(12.50m, ShippingCostCalculator.Calculate(1m, 500m, "islands"));

    [Theory]
    [InlineData(2.0, 4.95)]
    [InlineData(2.1, 6.05)] // extra kilos are rounded up
    [InlineData(5.0, 8.25)]
    public void Each_extra_kilo_over_two_adds_a_surcharge(decimal kg, decimal expected) =>
        Assert.Equal(expected, ShippingCostCalculator.Calculate(kg, 10m, "peninsula"));

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Rejects_non_positive_weight(decimal kg) =>
        Assert.Throws<ArgumentOutOfRangeException>(() => ShippingCostCalculator.Calculate(kg, 10m, "peninsula"));

    [Fact]
    public void Rejects_unknown_zone() =>
        Assert.Throws<ArgumentException>(() => ShippingCostCalculator.Calculate(1m, 10m, "moon"));
}
