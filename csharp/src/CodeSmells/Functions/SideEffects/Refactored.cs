namespace CodeSmells.Functions.SideEffects.Refactored;

public sealed class Cart
{
    public string CustomerId { get; init; } = "";
    public decimal Total { get; set; }
    public List<string> AppliedPromotions { get; } = new();
}

public sealed class PromotionService
{
    private const decimal MinimumTotal = 50m;
    private const decimal Discount = 10m;
    private const string Code = "SUMMER";

    public List<string> AuditLog { get; } = new();

    // REFACTOR: Separate Query from Modifier. The question is pure and idempotent...
    public bool IsEligibleForSummerPromo(Cart cart) =>
        cart.Total >= MinimumTotal && !cart.AppliedPromotions.Contains(Code);

    // ...and the state change has a name that announces it.
    public void ApplySummerPromo(Cart cart)
    {
        if (!IsEligibleForSummerPromo(cart))
        {
            return;
        }

        cart.Total -= Discount;
        cart.AppliedPromotions.Add(Code);
        AuditLog.Add($"promo {Code} applied to {cart.CustomerId}");
    }
}
