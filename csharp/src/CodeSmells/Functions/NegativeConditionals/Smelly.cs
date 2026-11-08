namespace CodeSmells.Functions.NegativeConditionals.Smelly;

public sealed class WarrantyClaim
{
    public DateOnly PurchaseDate { get; init; }
    public bool IsNotDamagedByUser { get; init; }
    public bool HasNoReceipt { get; init; }
}

public static class WarrantyDesk
{
    // SMELL: Negative Conditionals. Negatively named properties with negations on top:
    // "!HasNoReceipt", "!IsNotExpired", "if (!...) else". The reader has to do boolean algebra
    // in their head to understand when a claim is accepted.
    public static bool IsNotExpired(WarrantyClaim c, DateOnly today) => !(today > c.PurchaseDate.AddYears(2));

    public static string Review(WarrantyClaim claim, DateOnly today)
    {
        if (!claim.HasNoReceipt)
        {
            if (!(!IsNotExpired(claim, today)))
            {
                if (!(claim.IsNotDamagedByUser == false))
                    return "Accepted";
                else
                    return "Rejected: damage caused by misuse";
            }
            else
            {
                return "Rejected: warranty expired";
            }
        }
        return "Rejected: missing receipt";
    }
}
