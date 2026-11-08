namespace CodeSmells.CsharpSpecific.CatchGeneralException.Smelly;

public class CouponService
{
    private readonly Dictionary<string, decimal> _rates = new() { ["SAVE10"] = 0.10m, ["VIP25"] = 0.25m };

    // SMELL: catch (Exception) "just in case". It intends to handle the expected case (unknown coupon)
    //        but it also swallows programming errors: a null code (NullReferenceException),
    //        a bug in the calculation, even OutOfMemoryException... Everything becomes "no discount".
    public decimal DiscountedPrice(decimal price, string? couponCode)
    {
        try
        {
            var rate = _rates[couponCode!.Trim().ToUpperInvariant()];
            return price * (1 - rate);
        }
        catch (Exception)
        {
            return price;
        }
    }
}
