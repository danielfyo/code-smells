using R = CodeSmells.Bloaters.LongMethod.Refactored;
using S = CodeSmells.Bloaters.LongMethod.Smelly;

namespace CodeSmells.Tests.Bloaters;

public class LongMethodTests
{
    private static string Smelly(string customer, bool vip, string country, params (string Sku, int Qty, decimal Price)[] lines)
    {
        var order = new S.Order { CustomerName = customer, IsVip = vip, Country = country };
        foreach (var l in lines)
        {
            order.Lines.Add(new S.OrderLine { Sku = l.Sku, Quantity = l.Qty, UnitPrice = l.Price });
        }

        return new S.ReceiptService().BuildReceipt(order);
    }

    private static string Refactored(string customer, bool vip, string country, params (string Sku, int Qty, decimal Price)[] lines) =>
        new R.ReceiptService().BuildReceipt(new R.Order(customer, vip, country,
            lines.Select(l => new R.OrderLine(l.Sku, l.Qty, l.Price)).ToList()));

    [Theory]
    [InlineData(false, "ES")]
    [InlineData(true, "PT")]
    [InlineData(false, "US")]
    public void Both_versions_produce_the_same_receipt(bool vip, string country)
    {
        var lines = new[] { ("BOOK", 2, 15.50m), ("PEN", 10, 1.20m), ("LAMP", 1, 89.99m) };
        Assert.Equal(Smelly("Ana", vip, country, lines), Refactored("Ana", vip, country, lines));
    }

    [Fact]
    public void Small_order_pays_shipping_in_both()
    {
        var expected = Smelly("Luis", false, "ES", ("PEN", 2, 1m));
        Assert.Contains("Shipping: 4.99", expected);
        Assert.Equal(expected, Refactored("Luis", false, "ES", ("PEN", 2, 1m)));
    }

    [Fact]
    public void Both_reject_invalid_quantity()
    {
        Assert.Throws<ArgumentException>(() => Smelly("X", false, "ES", ("A", 0, 1m)));
        Assert.Throws<ArgumentException>(() => Refactored("X", false, "ES", ("A", 0, 1m)));
    }

    [Fact]
    public void Extracted_totals_can_be_tested_in_isolation()
    {
        var totals = R.ReceiptService.CalculateTotals(new R.Order("A", true, "ES", [new("X", 1, 100m)]));
        Assert.Equal(10m, totals.Discount);
        Assert.Equal(18.90m, totals.Tax);
        Assert.Equal(108.90m, totals.Total);
    }
}
