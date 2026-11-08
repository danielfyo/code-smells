namespace CodeSmells.OoAbusers.TemporaryField.Smelly;

public sealed record CartItem(string Sku, int Quantity, decimal UnitPrice);

/// <summary>Computes the final price of a cart applying a coupon and shipping.</summary>
public sealed class CheckoutCalculator
{
    // SMELL: Temporary Field. These fields only make sense while Calculate() is running;
    // outside of it they hold leftovers from the previous calculation. Also, the helper methods
    // rely on Calculate having filled them first, in the right order.
    private decimal _subtotal;
    private decimal _couponDiscount;
    private bool _freeShipping;

    public decimal Calculate(IReadOnlyList<CartItem> items, string? coupon)
    {
        _subtotal = items.Sum(i => i.Quantity * i.UnitPrice);
        ApplyCoupon(coupon);
        DecideShipping();
        return _subtotal - _couponDiscount + (_freeShipping ? 0m : 5m);
    }

    private void ApplyCoupon(string? coupon)
    {
        // SMELL: with no coupon the field is not reset: the previous call's discount stays.
        if (coupon == "WELCOME5") _couponDiscount = 5m;
        else if (coupon == "HALF") _couponDiscount = _subtotal / 2;
    }

    private void DecideShipping() => _freeShipping = _subtotal - _couponDiscount >= 40m;
}
