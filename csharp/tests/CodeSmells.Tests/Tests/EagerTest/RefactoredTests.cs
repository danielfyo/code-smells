using CodeSmells.Tests.EagerTest;

namespace CodeSmells.Tests.Tests.EagerTest;

// REFACTOR: one test per behaviour, with a descriptive name and an Arrange-Act-Assert structure.
//           When one fails, its name already says which rule is broken.
public class RefactoredTests
{
    private readonly ShoppingCart _cart = new();

    [Fact]
    public void Adding_the_same_sku_twice_accumulates_quantity()
    {
        _cart.Add("BOOK", 20m);
        _cart.Add("BOOK", 20m);

        Assert.Equal(2, _cart.ItemCount);
    }

    [Fact]
    public void Total_is_the_sum_of_price_times_quantity()
    {
        _cart.Add("BOOK", 20m, 2);
        _cart.Add("PEN", 2m, 5);

        Assert.Equal(50m, _cart.Total());
    }

    [Fact]
    public void Removing_a_sku_drops_all_its_units()
    {
        _cart.Add("PEN", 2m, 5);

        _cart.Remove("PEN");

        Assert.Equal(0, _cart.ItemCount);
    }

    [Fact]
    public void Valid_coupon_discounts_ten_percent()
    {
        _cart.Add("BOOK", 40m);

        _cart.ApplyCoupon("SAVE10");

        Assert.Equal(36m, _cart.Total());
    }

    [Fact]
    public void Invalid_coupon_is_rejected() =>
        Assert.Throws<ArgumentException>(() => _cart.ApplyCoupon("FREE"));

    [Fact]
    public void Zero_quantity_is_rejected() =>
        Assert.Throws<ArgumentOutOfRangeException>(() => _cart.Add("PEN", 2m, 0));
}
