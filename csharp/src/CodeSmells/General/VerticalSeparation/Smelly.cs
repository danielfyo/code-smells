namespace CodeSmells.General.VerticalSeparation.Smelly;

public sealed record Line(string Sku, int Quantity, decimal UnitPrice);

public class ShippingQuote
{
    public decimal Calculate(IReadOnlyList<Line> lines, string country)
    {
        // SMELL: every variable declared at the top "out of habit", far from where it is used.
        decimal surcharge = 0m;
        decimal perItem = 0.5m;
        var remote = new[] { "IC", "CE", "ML" };
        decimal baseCost;
        int items = 0;
        decimal subtotal = 0m;

        foreach (var line in lines)
        {
            subtotal += line.Quantity * line.UnitPrice;
        }

        if (subtotal >= 50m)
        {
            return 0m;
        }

        foreach (var line in lines)
        {
            items += line.Quantity;
        }

        baseCost = country == "ES" ? 4m : 9m;

        // SMELL: "remote" and "surcharge" were declared 20 lines above; the reader has to scroll up and down.
        if (remote.Contains(country))
        {
            surcharge = 6m;
        }

        return baseCost + surcharge + items * perItem + Round(0m);
    }

    // ... imagine a hundred lines of other methods here ...

    // SMELL: a helper used only once, far above, defined at the end of the file.
    private static decimal Round(decimal value) => Math.Round(value, 2);
}
