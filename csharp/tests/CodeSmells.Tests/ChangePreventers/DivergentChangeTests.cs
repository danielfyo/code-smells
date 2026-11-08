using S = CodeSmells.ChangePreventers.DivergentChange.Smelly;
using R = CodeSmells.ChangePreventers.DivergentChange.Refactored;

namespace CodeSmells.Tests.ChangePreventers;

public class DivergentChangeTests
{
    private const string Csv = "Keyboard;3;25.50\nMouse;10;9.99\nMonitor;1;180";

    [Fact]
    public void Both_produce_the_same_html()
    {
        var smelly = new S.SalesReport().Generate(Csv);
        var refactored = new R.SalesReport(new R.CsvSalesParser(), new R.HtmlSalesFormatter()).Generate(Csv);
        Assert.Equal(smelly, refactored);
        Assert.Contains("Best seller: Monitor", refactored);
    }

    [Fact]
    public void Presentation_can_change_without_touching_parsing_or_metrics()
    {
        var md = new R.SalesReport(new R.CsvSalesParser(), new R.MarkdownSalesFormatter()).Generate(Csv);
        Assert.EndsWith("**Total:** 356.40", md);
    }
}
