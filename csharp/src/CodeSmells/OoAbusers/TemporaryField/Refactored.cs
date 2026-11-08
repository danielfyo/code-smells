namespace CodeSmells.OoAbusers.TemporaryField.Refactored;

public sealed record CartItem(string Sku, int Quantity, decimal UnitPrice);

public sealed class CheckoutCalculator
{
    private const decimal ShippingFee = 5m;
    private const decimal FreeShippingThreshold = 40m;

    // REFACTOR: Replace Temporary Field with local variables / parameters. Intermediate values
    // travel as local variables and arguments: the class is stateless, every call is
    // independent and there is no hidden ordering between methods.
    public decimal Calculate(IReadOnlyList<CartItem> items, string? coupon)
    {
        var subtotal = items.Sum(i => i.Quantity * i.UnitPrice);
        var afterCoupon = subtotal - CouponDiscount(coupon, subtotal);
        var shipping = afterCoupon >= FreeShippingThreshold ? 0m : ShippingFee;
        return afterCoupon + shipping;
    }

    private static decimal CouponDiscount(string? coupon, decimal subtotal) => coupon switch
    {
        "WELCOME5" => 5m,
        "HALF" => subtotal / 2,
        _ => 0m,
    };
}
