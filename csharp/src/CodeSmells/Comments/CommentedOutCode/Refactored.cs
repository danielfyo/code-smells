namespace CodeSmells.Comments.CommentedOutCode.Refactored;

// REFACTOR: all commented-out code is deleted. If it is ever needed, it is in the git history
//           (git log -S "LegacyTaxService"). The file only contains what actually runs.
public class VatCalculator
{
    private static readonly IReadOnlyDictionary<string, decimal> RatesByCountry = new Dictionary<string, decimal>
    {
        ["ES"] = 0.21m,
        ["PT"] = 0.23m,
        ["FR"] = 0.20m,
    };

    public decimal AddVat(decimal netAmount, string countryCode)
    {
        var rate = RatesByCountry.GetValueOrDefault(countryCode, 0m);
        return Math.Round(netAmount * (1 + rate), 2, MidpointRounding.AwayFromZero);
    }
}
