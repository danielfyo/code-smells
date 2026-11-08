namespace CodeSmells.Tests.EagerTest;

// Production code. The "Eager Test" smell lives in tests/CodeSmells.Tests/Tests/EagerTest/.
public class ShoppingCart
{
    private readonly Dictionary<string, (decimal Price, int Quantity)> _lines = new();

    public int ItemCount => _lines.Values.Sum(l => l.Quantity);
    public string? CouponCode { get; private set; }

    public void Add(string sku, decimal price, int quantity = 1)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);
        _lines[sku] = _lines.TryGetValue(sku, out var line) ? (price, line.Quantity + quantity) : (price, quantity);
    }

    public void Remove(string sku) => _lines.Remove(sku);

    public void ApplyCoupon(string code) => CouponCode = code == "SAVE10" ? code : throw new ArgumentException("Invalid coupon");

    public decimal Total()
    {
        var subtotal = _lines.Values.Sum(l => l.Price * l.Quantity);
        return CouponCode is null ? subtotal : subtotal * 0.9m;
    }
}
