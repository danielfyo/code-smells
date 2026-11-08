namespace CodeSmells.General.VerticalSeparation.Refactored;

public sealed record Line(string Sku, int Quantity, decimal UnitPrice);

// REFACTOR: variables are declared right where they are used and helpers are placed immediately
//           below their caller ("step-down" rule): the file reads top to bottom like a newspaper.
public class ShippingQuote
{
    private const decimal FreeShippingThreshold = 50m;
    private const decimal CostPerItem = 0.5m;
    private static readonly HashSet<string> RemoteRegions = new() { "IC", "CE", "ML" };

    public decimal Calculate(IReadOnlyList<Line> lines, string country)
    {
        var subtotal = lines.Sum(line => line.Quantity * line.UnitPrice);
        if (subtotal >= FreeShippingThreshold)
        {
            return 0m;
        }

        var itemCount = lines.Sum(line => line.Quantity);
        return BaseCost(country) + RemoteSurcharge(country) + itemCount * CostPerItem;
    }

    private static decimal BaseCost(string country) => country == "ES" ? 4m : 9m;

    private static decimal RemoteSurcharge(string country) => RemoteRegions.Contains(country) ? 6m : 0m;
}
