using R = CodeSmells.General.MultipleLanguagesInFile.Refactored;
using S = CodeSmells.General.MultipleLanguagesInFile.Smelly;

namespace CodeSmells.Tests.General;

public class MultipleLanguagesInFileTests
{
    [Fact]
    public void Both_pages_render_the_same_rows()
    {
        var smelly = new S.OrderReportPage().Render(new[] { new S.Order(1, "Ana", 12.5m) });
        var refactored = new R.OrderReportPage().Render(new[] { new R.Order(1, "Ana", 12.5m) });

        const string row = "<tr><td>1</td><td>Ana</td><td class=\"total\">12.50</td></tr>";
        Assert.Contains(row, smelly);
        Assert.Contains(row, refactored);
    }

    [Fact]
    public void Smelly_page_does_not_escape_customer_names()
    {
        var evil = "<script>steal()</script>";
        var smelly = new S.OrderReportPage().Render(new[] { new S.Order(1, evil, 1m) });
        var refactored = new R.OrderReportPage().Render(new[] { new R.Order(1, evil, 1m) });

        Assert.Contains(evil, smelly);
        Assert.DoesNotContain(evil, refactored);
    }

    [Fact]
    public void Refactored_query_is_parameterized()
    {
        Assert.Contains("@minTotal", R.OrderQueries.OrdersAboveTotal);
        Assert.Contains(">= 100", new S.OrderReportPage().BuildQuery(100));
    }
}
