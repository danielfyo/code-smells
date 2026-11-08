namespace CodeSmells.Functions.DeepNesting.Refactored;

public sealed record Parcel(string? TrackingCode, decimal WeightKg, string? DestinationCountry, bool IsPaid);

public static class DispatchValidator
{
    private const decimal MaxWeightKg = 30m;

    // REFACTOR: Replace Nested Conditional with Guard Clauses. Each exceptional case exits as
    // soon as it is detected; the code stays flat and the happy path is the last line.
    public static string Validate(Parcel parcel, ISet<string> servedCountries)
    {
        if (parcel.TrackingCode is null)
        {
            return "Missing tracking code";
        }

        if (!parcel.IsPaid)
        {
            return "Payment pending";
        }

        if (parcel.WeightKg <= 0)
        {
            return "Invalid weight";
        }

        if (parcel.WeightKg > MaxWeightKg)
        {
            return "Too heavy";
        }

        if (parcel.DestinationCountry is null || !servedCountries.Contains(parcel.DestinationCountry))
        {
            return "Country not served";
        }

        return "OK";
    }
}
