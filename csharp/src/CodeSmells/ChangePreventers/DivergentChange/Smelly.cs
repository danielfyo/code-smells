using System.Globalization;
using System.Text;

namespace CodeSmells.ChangePreventers.DivergentChange.Smelly;

/// <summary>Sales report built from a "product;units;price" CSV.</summary>
// SMELL: Divergent Change. This class changes for completely different reasons:
//  - if the input format changes (CSV -> JSON) the parsing is touched,
//  - if the metrics change (add an average or top sellers) the calculation is touched,
//  - if the presentation changes (HTML -> Markdown) the formatting is touched.
// Three different teams editing the same class for three different reasons.
public sealed class SalesReport
{
    public string Generate(string csv)
    {
        var rows = new List<(string Product, int Units, decimal Price)>();
        foreach (var line in csv.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            var parts = line.Split(';');
            rows.Add((parts[0], int.Parse(parts[1], CultureInfo.InvariantCulture), decimal.Parse(parts[2], CultureInfo.InvariantCulture)));
        }

        var revenue = rows.Sum(r => r.Units * r.Price);
        var best = rows.OrderByDescending(r => r.Units * r.Price).First().Product;

        var sb = new StringBuilder();
        sb.Append("<h1>Sales</h1>");
        sb.Append("<ul>");
        foreach (var r in rows)
            sb.Append(CultureInfo.InvariantCulture, $"<li>{r.Product}: {r.Units * r.Price:0.00}</li>");
        sb.Append("</ul>");
        sb.Append(CultureInfo.InvariantCulture, $"<p>Total: {revenue:0.00}</p><p>Best seller: {best}</p>");
        return sb.ToString();
    }
}
