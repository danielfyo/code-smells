namespace CodeSmells.Bloaters.DataClumps.Smelly;

public sealed class ShippingService
{
    // SMELL: Data Clumps. street, city, postalCode and country always travel together through
    // every signature. If tomorrow "province" is needed, every method and every call must change.
    public string FormatLabel(string recipient, string street, string city, string postalCode, string country) =>
        $"{recipient}\n{street}\n{postalCode} {city}\n{country.ToUpperInvariant()}";

    public decimal ShippingCost(string street, string city, string postalCode, string country, decimal weightKg)
    {
        var baseCost = IsDomestic(street, city, postalCode, country) ? 3.5m : 12m;
        // SMELL: logic about the data group that has no home of its own.
        if (country == "ES" && (postalCode.StartsWith("35") || postalCode.StartsWith("38")))
            baseCost += 6m; // Canary Islands
        return baseCost + weightKg * 0.8m;
    }

    public bool IsDomestic(string street, string city, string postalCode, string country) => country == "ES";
}
