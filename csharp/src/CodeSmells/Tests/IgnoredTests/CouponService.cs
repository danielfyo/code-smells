namespace CodeSmells.Tests.IgnoredTests;

// Production code. The "Ignored Tests" smell lives in tests/CodeSmells.Tests/Tests/IgnoredTests/.
public class CouponService(TimeProvider clock)
{
    private readonly Dictionary<string, (decimal Rate, DateOnly ExpiresOn)> _coupons = new()
    {
        ["WELCOME10"] = (0.10m, new DateOnly(2030, 12, 31)),
        ["SUMMER24"] = (0.20m, new DateOnly(2024, 8, 31)),
    };

    public decimal Apply(string code, decimal amount)
    {
        if (!_coupons.TryGetValue(code, out var coupon))
        {
            return amount;
        }

        var today = DateOnly.FromDateTime(clock.GetLocalNow().DateTime);
        return today <= coupon.ExpiresOn ? amount * (1 - coupon.Rate) : amount;
    }
}
