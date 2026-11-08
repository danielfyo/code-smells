using S = CodeSmells.General.Imprecision.Smelly;
using R = CodeSmells.General.Imprecision.Refactored;

namespace CodeSmells.Tests.General;

public class ImprecisionTests
{
    private static readonly string[] Basket = { "GUM", "PEN" };

    [Fact]
    public void Smelly_double_loses_cents()
    {
        var list = new S.PriceList(new[] { new S.Product("GUM", "Gum", 0.1), new S.Product("PEN", "Pen", 0.2) });

        Assert.False(list.IsExactly(Basket, 0.3));
        Assert.NotEqual(0.3, list.Total(Basket));
    }

    [Fact]
    public void Refactored_decimal_is_exact()
    {
        var list = new R.PriceList(new[] { new R.Product("GUM", "Gum", 0.1m), new R.Product("PEN", "Pen", 0.2m) });

        Assert.True(list.IsExactly(Basket, 0.3m));
    }

    [Fact]
    public void Smelly_silently_picks_one_of_several_duplicates()
    {
        var smelly = new S.PriceList(new[] { new S.Product("GUM", "Gum", 0.1), new S.Product("GUM", "Gum XL", 0.5) });
        var refactored = new R.PriceList(new[] { new R.Product("GUM", "Gum", 0.1m), new R.Product("GUM", "Gum XL", 0.5m) });

        Assert.Equal("Gum", smelly.FindBySku("GUM").Name);
        Assert.Throws<InvalidOperationException>(() => refactored.FindBySku("GUM"));
        Assert.Throws<KeyNotFoundException>(() => refactored.FindBySku("NOPE"));
    }
}
