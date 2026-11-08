namespace CodeSmells.OoAbusers.BaseClassDependsOnSubclass.Smelly;

public abstract class Shipment
{
    public decimal WeightKg { get; init; }

    // SMELL: Base Class Depending on Its Derivatives. The base class asks about its concrete
    // subclasses. Every new subclass forces a change in the base (violating open/closed) and
    // the base cannot compile without knowing all of its children.
    public decimal Cost()
    {
        var baseCost = 2m + WeightKg * 1.1m;
        if (this is ExpressShipment) return baseCost * 2;
        if (this is InternationalShipment intl) return baseCost + intl.CustomsFee;
        return baseCost;
    }

    public int EstimatedDays() => this switch
    {
        ExpressShipment => 1,
        InternationalShipment => 7,
        _ => 3,
    };
}

public sealed class StandardShipment : Shipment { }
public sealed class ExpressShipment : Shipment { }
public sealed class InternationalShipment : Shipment
{
    public decimal CustomsFee { get; init; }
}
