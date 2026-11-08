namespace CodeSmells.Functions.NegativeConditionals.Refactored;

// REFACTOR: Rename to positive + Invert Conditional. Properties are named positively and
// conditions are expressed in their affirmative form, with guard clauses.
public sealed record WarrantyClaim(DateOnly PurchaseDate, bool WasDamagedByUser, bool HasReceipt)
{
    private const int WarrantyYears = 2;

    public bool IsCovered(DateOnly today) => today <= PurchaseDate.AddYears(WarrantyYears);
}

public static class WarrantyDesk
{
    public static string Review(WarrantyClaim claim, DateOnly today)
    {
        if (!claim.HasReceipt) return "Rejected: missing receipt";
        if (!claim.IsCovered(today)) return "Rejected: warranty expired";
        if (claim.WasDamagedByUser) return "Rejected: damage caused by misuse";
        return "Accepted";
    }
}
