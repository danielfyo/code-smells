namespace CodeSmells.Comments.CommentedOutCode.Smelly;

public class VatCalculator
{
    // private const decimal OldRate = 0.16m;
    // private readonly ILegacyTaxService _legacy = new LegacyTaxService();
    // SMELL: fields commented out "just in case". Nobody knows whether they can be deleted, so nobody does.

    public decimal AddVat(decimal netAmount, string countryCode)
    {
        // if (countryCode == "PT") return netAmount * 1.23m;
        // if (countryCode == "FR") return netAmount * 1.20m;
        // SMELL: old logic commented out. Was it disabled on purpose? Is it a bug? Version control
        //        already keeps this history; here it only distracts and slowly rots.

        var rate = countryCode switch
        {
            "ES" => 0.21m,
            "PT" => 0.23m,
            "FR" => 0.20m,
            _ => 0m,
        };

        // var rounded = Math.Round(netAmount * (1 + rate), 2, MidpointRounding.ToEven);
        // Console.WriteLine("DEBUG total=" + rounded);
        // return _legacy.Calculate(netAmount, countryCode);
        // SMELL: leftovers from debugging and from a previous implementation.
        return Math.Round(netAmount * (1 + rate), 2, MidpointRounding.AwayFromZero);
    }
}
