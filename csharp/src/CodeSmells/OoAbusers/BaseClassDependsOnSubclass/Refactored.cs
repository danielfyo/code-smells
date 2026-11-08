namespace CodeSmells.OoAbusers.BaseClassDependsOnSubclass.Refactored;

// REFACTOR: Replace Type Check with Polymorphism (Template Method). The base defines the common
// calculation and exposes virtual extension points; it knows nothing about its subclasses.
public abstract class Shipment(decimal weightKg)
{
    public decimal WeightKg { get; } = weightKg;

    protected decimal BaseCost => 2m + WeightKg * 1.1m;

    public virtual decimal Cost() => BaseCost;
    public virtual int EstimatedDays() => 3;
}

public sealed class StandardShipment(decimal weightKg) : Shipment(weightKg);

public sealed class ExpressShipment(decimal weightKg) : Shipment(weightKg)
{
    public override decimal Cost() => BaseCost * 2;
    public override int EstimatedDays() => 1;
}

public sealed class InternationalShipment(decimal weightKg, decimal customsFee) : Shipment(weightKg)
{
    public decimal CustomsFee { get; } = customsFee;
    public override decimal Cost() => BaseCost + CustomsFee;
    public override int EstimatedDays() => 7;
}
