namespace CodeSmells.Couplers.MessageChains.Smelly;

public sealed class Region { public string Name { get; init; } = ""; public string ShippingZone { get; init; } = ""; }
public sealed class City { public string Name { get; init; } = ""; public Region Region { get; init; } = new(); }
public sealed class Address { public string Street { get; init; } = ""; public City City { get; init; } = new(); }
public sealed class Customer { public string Name { get; init; } = ""; public Address Address { get; init; } = new(); }
public sealed class Order { public string Id { get; init; } = ""; public Customer Customer { get; init; } = new(); public decimal WeightKg { get; init; } }

public sealed class CourierSelector
{
    // SMELL: Message Chains (train wreck). To find the shipping zone the selector walks
    // Order -> Customer -> Address -> City -> Region. It is coupled to the whole structure:
    // if the zone starts depending on the postal code, this code (and every similar one) breaks.
    public string ChooseCourier(Order order)
    {
        var zone = order.Customer.Address.City.Region.ShippingZone;
        return zone switch
        {
            "ISLANDS" => "SeaFreight",
            "PENINSULA" when order.WeightKg > 20 => "HeavyCargo",
            _ => "StandardPost",
        };
    }

    public string Label(Order order) =>
        $"{order.Id} -> {order.Customer.Address.City.Name} ({order.Customer.Address.City.Region.Name})";
}
