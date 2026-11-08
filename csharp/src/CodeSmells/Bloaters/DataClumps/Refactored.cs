namespace CodeSmells.Bloaters.DataClumps.Refactored;

// REFACTOR: Extract Class / Introduce Parameter Object. The data group becomes an Address
// record and the behavior that depends only on it moves inside (Move Method).
public sealed record Address(string Street, string City, string PostalCode, string Country)
{
    public bool IsDomestic => Country == "ES";

    public bool IsCanaryIslands =>
        Country == "ES" && (PostalCode.StartsWith("35", StringComparison.Ordinal) || PostalCode.StartsWith("38", StringComparison.Ordinal));

    public string ToLabelLines() => $"{Street}\n{PostalCode} {City}\n{Country.ToUpperInvariant()}";
}

public sealed class ShippingService
{
    public string FormatLabel(string recipient, Address address) => $"{recipient}\n{address.ToLabelLines()}";

    public decimal ShippingCost(Address address, decimal weightKg)
    {
        var baseCost = address.IsDomestic ? 3.5m : 12m;
        if (address.IsCanaryIslands)
        {
            baseCost += 6m;
        }

        return baseCost + weightKg * 0.8m;
    }
}
