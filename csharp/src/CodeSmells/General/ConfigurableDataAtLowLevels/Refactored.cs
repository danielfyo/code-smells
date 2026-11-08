namespace CodeSmells.General.ConfigurableDataAtLowLevels.Refactored;

// REFACTOR: configuration moves up to an options object defined at the highest level (composition root)
//           and is passed down. Default values are visible in a single place.
public sealed record ShippingOptions
{
    public string Origin { get; init; } = "Madrid";
    public IReadOnlyList<string> Carriers { get; init; } = new[] { "SEUR", "MRW" };
    public int MaxLocalDistanceKm { get; init; } = 50;
}

public class ShippingLabelPrinter(ShippingOptions options)
{
    private readonly RateTable _rates = new(options);

    public string Print(string orderId, string city) => $"[{orderId}] {city} - {_rates.Cheapest(city)}";
}

internal sealed class RateTable(ShippingOptions options)
{
    public string Cheapest(string city)
    {
        var distance = city == options.Origin ? 0 : 400;
        return distance <= options.MaxLocalDistanceKm ? "Courier local" : options.Carriers[0];
    }
}
