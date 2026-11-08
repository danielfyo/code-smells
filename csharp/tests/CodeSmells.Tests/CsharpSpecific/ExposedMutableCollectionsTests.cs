using S = CodeSmells.CsharpSpecific.ExposedMutableCollections.Smelly;
using R = CodeSmells.CsharpSpecific.ExposedMutableCollections.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class ExposedMutableCollectionsTests
{
    [Fact]
    public void Both_orders_enforce_rules_through_AddLine()
    {
        var smelly = new S.Order();
        var refactored = new R.Order();
        for (var i = 0; i < 3; i++)
        {
            smelly.AddLine($"SKU{i}", 1, 10m);
            refactored.AddLine($"SKU{i}", 1, 10m);
        }

        Assert.Equal(smelly.Total, refactored.Total);
        Assert.Throws<InvalidOperationException>(() => smelly.AddLine("X", 1, 1m));
        Assert.Throws<InvalidOperationException>(() => refactored.AddLine("X", 1, 1m));
    }

    [Fact]
    public void Smelly_collection_lets_callers_break_the_invariants()
    {
        var order = new S.Order();

        order.Lines.AddRange(Enumerable.Range(0, 5).Select(i => new S.OrderLine($"SKU{i}", -1, 10m)));

        Assert.True(order.Lines.Count > S.Order.MaxLines);
        Assert.True(order.Total < 0);
    }

    [Fact]
    public void Refactored_collection_cannot_be_modified_from_outside()
    {
        var order = new R.Order();
        order.AddLine("BOOK", 1, 10m);

        var lines = Assert.IsAssignableFrom<ICollection<R.OrderLine>>(order.Lines);
        Assert.True(lines.IsReadOnly);
        Assert.Throws<NotSupportedException>(() => lines.Add(new R.OrderLine("X", -1, 1m)));
    }
}
