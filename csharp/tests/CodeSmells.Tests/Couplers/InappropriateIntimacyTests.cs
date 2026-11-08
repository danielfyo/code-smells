using S = CodeSmells.Couplers.InappropriateIntimacy.Smelly;
using R = CodeSmells.Couplers.InappropriateIntimacy.Refactored;

namespace CodeSmells.Tests.Couplers;

public class InappropriateIntimacyTests
{
    [Fact]
    public void Fulfilling_updates_stock_and_status_equally()
    {
        var sw = new S.Warehouse { StockBySku = { ["A"] = 5, ["B"] = 1 } };
        var so1 = new S.PurchaseOrder { InternalLines = { ("A", 3) } };
        var so2 = new S.PurchaseOrder { InternalLines = { ("B", 2) } };
        sw.Fulfill(so1); sw.Fulfill(so2);

        var rw = new R.Warehouse();
        rw.Receive("A", 5); rw.Receive("B", 1);
        var ro1 = new R.PurchaseOrder([new("A", 3)]);
        var ro2 = new R.PurchaseOrder([new("B", 2)]);
        rw.Fulfill(ro1); rw.Fulfill(ro2);

        Assert.Equal(sw.StockBySku["A"], rw.StockOf("A"));
        Assert.Equal(sw.StockBySku["B"], rw.StockOf("B"));
        Assert.Equal(("SHIPPED", "BACKORDER"), (so1.StatusCode, so2.StatusCode));
        Assert.Equal((R.OrderStatus.Shipped, R.OrderStatus.Backorder), (ro1.Status, ro2.Status));
    }

    [Fact]
    public void Smelly_warehouse_destroys_the_order_lines()
    {
        var sw = new S.Warehouse { StockBySku = { ["A"] = 5 } };
        var so = new S.PurchaseOrder { InternalLines = { ("A", 1) } };
        sw.Fulfill(so);
        Assert.Empty(so.InternalLines); // side effect of the intimacy

        var rw = new R.Warehouse(); rw.Receive("A", 5);
        var ro = new R.PurchaseOrder([new("A", 1)]);
        rw.Fulfill(ro);
        Assert.Single(ro.Lines);
    }
}
