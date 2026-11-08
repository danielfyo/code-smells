namespace CodeSmells.Couplers.MessageChains.Refactored;

public sealed record Region(string Name, string ShippingZone);
public sealed record City(string Name, Region Region);

// REFACTOR: Hide Delegate. Each object exposes what its clients need and hides how it gets it.
// The selector only talks to Order (Law of Demeter).
public sealed record Address(string Street, City City)
{
    public string ShippingZone => City.Region.ShippingZone;
    public string Destination => $"{City.Name} ({City.Region.Name})";
}

public sealed record Customer(string Name, Address Address);

public sealed record Order(string Id, Customer Customer, decimal WeightKg)
{
    public string ShippingZone => Customer.Address.ShippingZone;
    public string Destination => Customer.Address.Destination;
}

public sealed class CourierSelector
{
    public string ChooseCourier(Order order) => (order.ShippingZone, order.WeightKg) switch
    {
        ("ISLANDS", _) => "SeaFreight",
        ("PENINSULA", > 20) => "HeavyCargo",
        _ => "StandardPost",
    };

    public string Label(Order order) => $"{order.Id} -> {order.Destination}";
}
