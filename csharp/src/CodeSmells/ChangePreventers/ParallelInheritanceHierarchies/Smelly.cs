namespace CodeSmells.ChangePreventers.ParallelInheritanceHierarchies.Smelly;

// SMELL: Parallel Inheritance Hierarchies. For every vehicle type in the fleet you also have to
// create its insurance subclass (and register it in the factory). Adding "Motorbike" requires
// touching two hierarchies and the switch that pairs them; forgetting one is only detected at runtime.

public abstract class Vehicle
{
    public string Plate { get; init; } = "";
    public decimal Value { get; init; }
}

public sealed class Car : Vehicle { public int Seats { get; init; } }
public sealed class Truck : Vehicle { public decimal PayloadTons { get; init; } }

public abstract class VehicleInsurance
{
    public abstract decimal AnnualPremium(Vehicle vehicle);
}

public sealed class CarInsurance : VehicleInsurance
{
    public override decimal AnnualPremium(Vehicle vehicle)
    {
        var car = (Car)vehicle; // SMELL: downcast because the parallel hierarchy does not know the type
        return vehicle.Value * 0.03m + car.Seats * 10m;
    }
}

public sealed class TruckInsurance : VehicleInsurance
{
    public override decimal AnnualPremium(Vehicle vehicle)
    {
        var truck = (Truck)vehicle;
        return vehicle.Value * 0.05m + truck.PayloadTons * 40m;
    }
}

public static class InsuranceFactory
{
    public static VehicleInsurance For(Vehicle v) => v switch
    {
        Car => new CarInsurance(),
        Truck => new TruckInsurance(),
        _ => throw new NotSupportedException($"No insurance for {v.GetType().Name}"),
    };
}
