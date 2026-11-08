using System.Globalization;
using System.Net;
using System.Text;

namespace CodeSmells.General.MultipleLanguagesInFile.Refactored;

public sealed record Order(int Id, string Customer, decimal Total);

// REFACTOR: each language is isolated behind a clear boundary. In a real project the query would live in a
//           .sql file/ORM, the view in a Razor template and the CSS/JS in static files; here they are split
//           into dedicated types so the C# logic does not contain other languages.
public static class OrderQueries
{
    // REFACTOR: the query is parameterized (no concatenation) and lives in a single place.
    public const string OrdersAboveTotal =
        "SELECT Id, Customer, Total FROM Orders WHERE Total >= @minTotal ORDER BY Total DESC";
}

public static class OrderReportTemplate
{
    // REFACTOR: the "template" is reduced to static markup; styles and scripts are referenced as files.
    public const string Layout =
        "<html><head><link rel=\"stylesheet\" href=\"orders.css\"></head><body>" +
        "<table id=\"orders\">{0}</table><script src=\"orders.js\"></script></body></html>";

    public const string Row = "<tr><td>{0}</td><td>{1}</td><td class=\"total\">{2}</td></tr>";
}

public class OrderReportPage
{
    // The templates are parsed once and reused for every render.
    private static readonly CompositeFormat Layout = CompositeFormat.Parse(OrderReportTemplate.Layout);
    private static readonly CompositeFormat Row = CompositeFormat.Parse(OrderReportTemplate.Row);

    public string Render(IEnumerable<Order> orders)
    {
        var culture = CultureInfo.InvariantCulture;
        var rows = orders.Select(o => string.Format(
            culture,
            Row,
            o.Id,
            WebUtility.HtmlEncode(o.Customer), // REFACTOR: data is always escaped.
            o.Total.ToString("0.00", culture)));

        return string.Format(culture, Layout, string.Concat(rows));
    }
}
