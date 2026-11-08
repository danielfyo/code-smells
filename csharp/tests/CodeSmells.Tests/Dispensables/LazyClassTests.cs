using R = CodeSmells.Dispensables.LazyClass.Refactored;
using S = CodeSmells.Dispensables.LazyClass.Smelly;

namespace CodeSmells.Tests.Dispensables;

public class LazyClassTests
{
    [Fact]
    public void Both_behave_the_same()
    {
        var s = new S.InventoryItem("  ab-12 ", 2);
        var r = new R.InventoryItem("  ab-12 ", 2);
        Assert.Equal(s.Sku, r.Sku);
        Assert.Equal("AB-12", r.Sku);
        s.Remove(2); r.Remove(2);
        Assert.Equal(s.IsAvailable, r.IsAvailable);
        Assert.False(r.IsAvailable);
        Assert.Throws<InvalidOperationException>(() => s.Remove(1));
        Assert.Throws<InvalidOperationException>(() => r.Remove(1));
    }
}
