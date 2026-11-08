namespace CodeSmells.Functions.SideEffects.Smelly;

public sealed class Cart
{
    public string CustomerId { get; init; } = "";
    public decimal Total { get; set; }
    public List<string> AppliedPromotions { get; } = new();
}

public sealed class PromotionService
{
    public List<string> AuditLog { get; } = new();

    // SMELL: Side Effects. The name promises a question ("is it eligible?") but it also applies
    // the discount to the cart and writes to the log. Calling it twice (e.g. to show a banner
    // on screen and later at checkout) discounts twice.
    public bool IsEligibleForSummerPromo(Cart cart)
    {
        if (cart.Total < 50m) return false;
        cart.Total -= 10m;
        cart.AppliedPromotions.Add("SUMMER");
        AuditLog.Add($"promo SUMMER applied to {cart.CustomerId}");
        return true;
    }
}
