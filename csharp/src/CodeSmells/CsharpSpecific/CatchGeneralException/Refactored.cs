namespace CodeSmells.CsharpSpecific.CatchGeneralException.Refactored;

public class CouponService
{
    private readonly Dictionary<string, decimal> _rates = new() { ["SAVE10"] = 0.10m, ["VIP25"] = 0.25m };

    // REFACTOR: the expected case (unknown coupon) is handled WITHOUT exceptions (TryGetValue), and
    //           programming errors (null argument) fail early and visibly.
    //           If catching were needed, catch only the specific type you know how to handle.
    public decimal DiscountedPrice(decimal price, string couponCode)
    {
        ArgumentNullException.ThrowIfNull(couponCode);

        return _rates.TryGetValue(couponCode.Trim().ToUpperInvariant(), out var rate)
            ? price * (1 - rate)
            : price;
    }
}
