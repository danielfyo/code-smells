using R = CodeSmells.General.HiddenLogicalDependency.Refactored;
using S = CodeSmells.General.HiddenLogicalDependency.Smelly;

namespace CodeSmells.Tests.General;

public class HiddenLogicalDependencyTests
{
    [Fact]
    public void Both_reporters_produce_the_same_pages()
    {
        var sales = Enumerable.Range(1, 7).Select(i => $"Sale #{i}").ToList();

        var smelly = new S.SalesReporter(new S.PageFormatter()).Report(sales);
        var refactored = new R.SalesReporter(new R.PageFormatter()).Report(sales);

        Assert.Equal(3, smelly.Count);
        Assert.Equal(smelly, refactored);
    }

    [Fact]
    public void Refactored_formatter_rejects_pages_that_break_its_assumption()
    {
        var tooManyLines = new[] { "a", "b", "c", "d" };

        Assert.Contains("4/3", new S.PageFormatter().FormatPage(1, tooManyLines)); // silently corrupted output
        Assert.Throws<ArgumentException>(() => new R.PageFormatter().FormatPage(1, tooManyLines));
    }
}
