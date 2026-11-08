namespace CodeSmells.General.ObscuredIntent.Refactored;

public static class Billing
{
    // REFACTOR: express the intent with the rule as everyone knows it
    //           (or, even better, use DateTime.IsLeapYear, which is what this method does).
    public static bool IsLeapYear(int year) =>
        year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);

    private const decimal PremiumDiscountRate = 0.10m;
    private const decimal StandardHandlingFee = 2.5m;
    private const int GracePeriodDays = 30;
    private const decimal LargeInvoiceThreshold = 1_000m;

    // REFACTOR: Extract Variable / Extract Method: each concept has a name and they are combined at the end.
    public static decimal CalculateFee(decimal amount, bool isPremium, int daysOverdue)
    {
        var discounted = isPremium ? amount * (1 - PremiumDiscountRate) : amount;
        var handlingFee = isPremium ? 0m : StandardHandlingFee;
        return discounted + LatePaymentPenalty(amount, daysOverdue) + handlingFee;
    }

    private static decimal LatePaymentPenalty(decimal amount, int daysOverdue)
    {
        var lateDays = daysOverdue - GracePeriodDays;
        if (lateDays <= 0)
        {
            return 0m;
        }

        var dailyRate = amount > LargeInvoiceThreshold ? 0.002m : 0.005m;
        return lateDays * dailyRate * amount;
    }
}
