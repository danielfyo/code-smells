using S = CodeSmells.CsharpSpecific.MultipleEnumeration.Smelly;
using R = CodeSmells.CsharpSpecific.MultipleEnumeration.Refactored;

namespace CodeSmells.Tests.CsharpSpecific;

public class MultipleEnumerationTests
{
    // Simulates an expensive deferred query (e.g. against a database) and counts how many times it runs.
    private sealed class CountingQuery(params decimal[] rows)
    {
        public int Executions { get; private set; }

        public IEnumerable<decimal> Run()
        {
            Executions++;
            foreach (var row in rows) yield return row;
        }
    }

    [Fact]
    public void Smelly_executes_the_query_four_times()
    {
        var query = new CountingQuery(10m, 30m, 20m);

        var stats = S.SalesReport.Summarize(Wrap(query));

        Assert.Equal(new S.SalesStats(3, 60m, 30m), stats);
        Assert.Equal(4, query.Executions);
    }

    [Fact]
    public void Refactored_executes_the_query_once()
    {
        var query = new CountingQuery(10m, 30m, 20m);

        var stats = R.SalesReport.Summarize(Wrap(query));

        Assert.Equal(new R.SalesStats(3, 60m, 30m), stats);
        Assert.Equal(1, query.Executions);
    }

    [Fact]
    public void Both_handle_empty_input()
    {
        Assert.Equal(new S.SalesStats(0, 0, 0), S.SalesReport.Summarize(Array.Empty<decimal>()));
        Assert.Equal(new R.SalesStats(0, 0, 0), R.SalesReport.Summarize(Array.Empty<decimal>()));
    }

    // Every enumeration calls Run() again, just like a deferred LINQ query.
    private static IEnumerable<decimal> Wrap(CountingQuery query)
    {
        foreach (var row in query.Run()) yield return row;
    }
}
