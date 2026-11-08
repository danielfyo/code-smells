namespace CodeSmells.General.ConfigurableDataAtLowLevels.Smelly;

public class ShippingLabelPrinter
{
    public string Print(string orderId, string city) => $"[{orderId}] {city} - {CarrierFor(city)}";

    private static string CarrierFor(string city) => new RateTable().Cheapest(city);
}

internal class RateTable
{
    public string Cheapest(string city)
    {
        // SMELL: configuration data (threshold, carriers, origin city) buried at the lowest level.
        //        Changing carrier means finding this line and recompiling;
        //        and no test can try a different configuration.
        const string origin = "Madrid";
        var carriers = new[] { "SEUR", "MRW" };
        const int maxLocalDistanceKm = 50;

        var distance = city == origin ? 0 : 400;
        return distance <= maxLocalDistanceKm ? "Courier local" : carriers[0];
    }
}
