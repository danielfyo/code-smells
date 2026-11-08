namespace CodeSmells.Dispensables.SpeculativeGenerality.Refactored;

public sealed record Parcel(decimal WeightKg);

// REFACTOR: Collapse Hierarchy + Inline Class + Remove Parameter (YAGNI). What is needed today is
// a formula; when a second kind of rate shows up, the interface can be extracted then.
public static class ParcelPricing
{
    private const decimal BaseFee = 3m;
    private const decimal PerKg = 0.75m;

    public static decimal Price(Parcel parcel) => BaseFee + parcel.WeightKg * PerKg;
}
