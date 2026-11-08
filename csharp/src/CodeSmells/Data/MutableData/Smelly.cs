namespace CodeSmells.Data.MutableData.Smelly;

public sealed class Stop
{
    public string City { get; set; } = "";
    public int DistanceFromDepotKm { get; set; }
}

/// <summary>Delivery route with its stops.</summary>
public sealed class DeliveryRoute
{
    // SMELL: Mutable Data. The internal list is exposed as is and the stops have setters.
    // Anyone who receives it can reorder it or change distances, and the change propagates
    // to everybody sharing the reference.
    public List<Stop> Stops { get; } = new();

    public int TotalKm() => Stops.Count == 0 ? 0 : Stops.Max(s => s.DistanceFromDepotKm) * 2;
}

public static class RoutePlanner
{
    // SMELL: a "query" that mutates its argument: it sorts the caller's list in place and rounds
    // the distances, altering the original route when nobody expects it.
    public static List<Stop> NearestFirst(DeliveryRoute route)
    {
        route.Stops.Sort((a, b) => a.DistanceFromDepotKm.CompareTo(b.DistanceFromDepotKm));
        foreach (var stop in route.Stops)
            stop.DistanceFromDepotKm = (int)Math.Ceiling(stop.DistanceFromDepotKm / 10.0) * 10;
        return route.Stops;
    }
}
