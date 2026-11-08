using System.Globalization;
using System.Text;

namespace CodeSmells.ChangePreventers.DivergentChange.Refactored;

public sealed record SaleRow(string Product, int Units, decimal Price)
{
    public decimal Revenue => Units * Price;
}

public sealed record SalesSummary(IReadOnlyList<SaleRow> Rows, decimal TotalRevenue, string BestSeller);

// REFACTOR: Extract Class (Split Phase). Each reason to change has its own class:
// parsing, calculation and presentation evolve separately and can be replaced.
public interface ISalesParser { IReadOnlyList<SaleRow> Parse(string input); }
public interface ISalesFormatter { string Format(SalesSummary summary); }

public sealed class CsvSalesParser : ISalesParser
{
    public IReadOnlyList<SaleRow> Parse(string input) =>
        input.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(line => line.Split(';'))
            .Select(p => new SaleRow(p[0], int.Parse(p[1], CultureInfo.InvariantCulture), decimal.Parse(p[2], CultureInfo.InvariantCulture)))
            .ToList();
}

public static class SalesCalculator
{
    public static SalesSummary Summarize(IReadOnlyList<SaleRow> rows) =>
        new(rows, rows.Sum(r => r.Revenue), rows.MaxBy(r => r.Revenue)!.Product);
}

public sealed class HtmlSalesFormatter : ISalesFormatter
{
    public string Format(SalesSummary summary)
    {
        var c = CultureInfo.InvariantCulture;
        var sb = new StringBuilder("<h1>Sales</h1><ul>");
        foreach (var r in summary.Rows) sb.Append(c, $"<li>{r.Product}: {r.Revenue:0.00}</li>");
        sb.Append("</ul>");
        sb.Append(c, $"<p>Total: {summary.TotalRevenue:0.00}</p><p>Best seller: {summary.BestSeller}</p>");
        return sb.ToString();
    }
}

public sealed class MarkdownSalesFormatter : ISalesFormatter
{
    public string Format(SalesSummary summary) =>
        string.Join("\n", summary.Rows.Select(r => string.Create(CultureInfo.InvariantCulture, $"- {r.Product}: {r.Revenue:0.00}")))
        + string.Create(CultureInfo.InvariantCulture, $"\n**Total:** {summary.TotalRevenue:0.00}");
}

/// <summary>Coordinator: it only composes the pieces.</summary>
public sealed class SalesReport(ISalesParser parser, ISalesFormatter formatter)
{
    public string Generate(string input) => formatter.Format(SalesCalculator.Summarize(parser.Parse(input)));
}
