namespace CodeSmells.Functions.DeepNesting.Smelly;

public sealed record Parcel(string? TrackingCode, decimal WeightKg, string? DestinationCountry, bool IsPaid);

public static class DispatchValidator
{
    // SMELL: Deep Nesting / Arrow Code. Five levels of nested ifs: the happy path sits in the
    // middle of the arrow and every 'else' is dozens of lines away from its condition.
    public static string Validate(Parcel parcel, ISet<string> servedCountries)
    {
        if (parcel.TrackingCode != null)
        {
            if (parcel.IsPaid)
            {
                if (parcel.WeightKg > 0)
                {
                    if (parcel.WeightKg <= 30)
                    {
                        if (parcel.DestinationCountry != null && servedCountries.Contains(parcel.DestinationCountry))
                        {
                            return "OK";
                        }
                        else
                        {
                            return "Country not served";
                        }
                    }
                    else
                    {
                        return "Too heavy";
                    }
                }
                else
                {
                    return "Invalid weight";
                }
            }
            else
            {
                return "Payment pending";
            }
        }
        else
        {
            return "Missing tracking code";
        }
    }
}
