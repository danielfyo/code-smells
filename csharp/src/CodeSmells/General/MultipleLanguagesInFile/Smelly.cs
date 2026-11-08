namespace CodeSmells.General.MultipleLanguagesInFile.Smelly;

public sealed record Order(int Id, string Customer, decimal Total);

public class OrderReportPage
{
    // SMELL: SQL embedded in the middle of the class that generates HTML.
    public string BuildQuery(int minTotal) =>
        "SELECT Id, Customer, Total FROM Orders WHERE Total >= " + minTotal + " ORDER BY Total DESC";

    // SMELL: HTML, CSS and JavaScript concatenated inside C#. Four languages in one file:
    //        no highlighting, no validation, no escaping (XSS) and design changes that require recompiling.
    public string Render(IEnumerable<Order> orders)
    {
        var html = "<html><head><style>.total{font-weight:bold;color:#c00}</style></head><body>";
        html += "<table id=\"orders\">";
        foreach (var o in orders)
        {
            html += "<tr><td>" + o.Id + "</td><td>" + o.Customer + "</td><td class=\"total\">" + o.Total.ToString("0.00") + "</td></tr>";
        }
        html += "</table>";
        html += "<script>document.getElementById('orders').onclick=function(){alert('Orders!')}</script>";
        html += "</body></html>";
        return html;
    }
}
