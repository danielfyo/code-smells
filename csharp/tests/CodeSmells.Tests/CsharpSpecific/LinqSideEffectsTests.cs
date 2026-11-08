using S = CodeSmells.CsharpSpecific.LinqSideEffects.Smelly;
using R = CodeSmells.CsharpSpecific.LinqSideEffects.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class LinqSideEffectsTests
{
    private static readonly (string Sku, int Stock)[] Data = { ("BOOK", 2), ("PEN", 50), ("LAMP", 0) };

    [Fact]
    public void Smelly_sends_nothing_if_the_result_is_never_enumerated()
    {
        var alerter = new S.LowStockAlerter();

        _ = alerter.FindLowStock(Data.Select(d => new S.Product(d.Sku, d.Stock)));

        Assert.Empty(alerter.AlertsSent);
    }

    [Fact]
    public void Smelly_sends_duplicates_when_enumerated_twice()
    {
        var alerter = new S.LowStockAlerter();
        var lowStock = alerter.FindLowStock(Data.Select(d => new S.Product(d.Sku, d.Stock)));

        var count = lowStock.Count();
        var skus = lowStock.ToList();

        Assert.Equal(2, count);
        Assert.Equal(4, alerter.AlertsSent.Count); // each alert sent twice
    }

    [Fact]
    public void Refactored_sends_each_alert_exactly_once()
    {
        var alerter = new R.LowStockAlerter();

        var skus = alerter.SendLowStockAlerts(Data.Select(d => new R.Product(d.Sku, d.Stock)));

        Assert.Equal(new[] { "BOOK", "LAMP" }, skus);
        Assert.Equal(new[] { "Low stock: BOOK", "Low stock: LAMP" }, alerter.AlertsSent);
    }
}
