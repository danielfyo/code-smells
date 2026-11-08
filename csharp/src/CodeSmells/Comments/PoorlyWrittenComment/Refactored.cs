namespace CodeSmells.Comments.PoorlyWrittenComment.Refactored;

/// <summary>
/// Loyalty discount: orders of at least <see cref="MinimumOrderAmount"/> get 10% off;
/// VIP customers, or customers for 5 years or more, get 15% off.
/// </summary>
// REFACTOR: a single clear, complete and well-written comment that explains the business rule.
//           Magic numbers become named constants, which make the "i think"s unnecessary.
public class LoyaltyDiscountPolicy
{
    public const decimal MinimumOrderAmount = 100m;
    public const int SeniorCustomerYears = 5;
    private const decimal StandardRate = 0.10m;
    private const decimal PremiumRate = 0.15m;

    public decimal Apply(decimal amount, int yearsAsCustomer, bool isVip)
    {
        if (amount < MinimumOrderAmount)
        {
            return amount;
        }

        var isPremium = isVip || yearsAsCustomer >= SeniorCustomerYears;
        var rate = isPremium ? PremiumRate : StandardRate;
        return amount * (1 - rate);
    }
}
