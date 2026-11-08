namespace CodeSmells.ChangePreventers.ParallelInheritanceHierarchies.Refactored;

// REFACTOR: Move Method + Collapse Hierarchy. The premium calculation moves into the vehicle
// hierarchy, which owns the data. The parallel hierarchy, the downcasts and the factory disappear;
// a new vehicle does not compile until it defines its premium.
public abstract record Vehicle(string Plate, decimal Value)
{
    public abstract decimal AnnualPremium();
}

public sealed record Car(string Plate, decimal Value, int Seats) : Vehicle(Plate, Value)
{
    public override decimal AnnualPremium() => Value * 0.03m + Seats * 10m;
}

public sealed record Truck(string Plate, decimal Value, decimal PayloadTons) : Vehicle(Plate, Value)
{
    public override decimal AnnualPremium() => Value * 0.05m + PayloadTons * 40m;
}

public sealed record Motorbike(string Plate, decimal Value) : Vehicle(Plate, Value)
{
    public override decimal AnnualPremium() => Value * 0.04m;
}
