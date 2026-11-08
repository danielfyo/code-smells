using System.Collections.Immutable;

namespace CodeSmells.Data.MutableData.Refactored;

// REFACTOR: Change Reference to Value + Encapsulate Collection. Stops and route are immutable;
// operations return new values instead of modifying existing ones.
public sealed record Stop(string City, int DistanceFromDepotKm)
{
    public Stop RoundedUpToTens() => this with { DistanceFromDepotKm = (int)Math.Ceiling(DistanceFromDepotKm / 10.0) * 10 };
}

public sealed record DeliveryRoute(ImmutableList<Stop> Stops)
{
    public static DeliveryRoute Of(params Stop[] stops) => new(stops.ToImmutableList());

    public DeliveryRoute AddStop(Stop stop) => new(Stops.Add(stop));

    public int TotalKm() => Stops.IsEmpty ? 0 : Stops.Max(s => s.DistanceFromDepotKm) * 2;
}

public static class RoutePlanner
{
    public static IReadOnlyList<Stop> NearestFirst(DeliveryRoute route) =>
        route.Stops.OrderBy(s => s.DistanceFromDepotKm).Select(s => s.RoundedUpToTens()).ToList();
}
