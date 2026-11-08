using S = CodeSmells.CsharpSpecific.StringConcatInLoop.Smelly;
using R = CodeSmells.CsharpSpecific.StringConcatInLoop.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class StringConcatInLoopTests
{
    [Fact]
    public void All_versions_build_the_same_csv()
    {
        var data = Enumerable.Range(1, 500).Select(i => (Id: i, Customer: $"customer{i}", Amount: i * 1.5m)).ToList();

        var smelly = S.OrderCsv.Build(data.Select(d => new S.Order(d.Id, d.Customer, d.Amount)));
        var refactored = R.OrderCsv.Build(data.Select(d => new R.Order(d.Id, d.Customer, d.Amount)));
        var joined = R.OrderCsv.BuildWithJoin(data.Select(d => new R.Order(d.Id, d.Customer, d.Amount)));

        Assert.Equal(smelly, refactored);
        Assert.Equal(smelly, joined);
        Assert.Equal(501, smelly.Count(c => c == '\n'));
    }

    [Fact]
    public void Empty_input_yields_only_the_header()
    {
        Assert.Equal("id;customer;amount\n", S.OrderCsv.Build(Array.Empty<S.Order>()));
        Assert.Equal("id;customer;amount\n", R.OrderCsv.Build(Array.Empty<R.Order>()));
    }
}
