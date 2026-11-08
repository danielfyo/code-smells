using System.Globalization;
using System.Text;

namespace CodeSmells.Bloaters.LongMethod.Refactored;

public sealed record OrderLine(string Sku, int Quantity, decimal UnitPrice)
{
    public decimal Amount => Quantity * UnitPrice;
}

public sealed record Order(string CustomerName, bool IsVip, string Country, IReadOnlyList<OrderLine> Lines);

/// <summary>Already computed amounts of an order.</summary>
public sealed record ReceiptTotals(decimal Subtotal, decimal Discount, decimal Tax, decimal Shipping)
{
    public decimal Total => Subtotal - Discount + Tax + Shipping;
}

public sealed class ReceiptService
{
    private const decimal FreeShippingThreshold = 50m;
    private const decimal StandardShipping = 4.99m;

    // REFACTOR: Extract Method. The main method reads like a table of contents of high-level
    // steps; each step has its own name and can be tested and changed separately.
    public string BuildReceipt(Order order)
    {
        Validate(order);
        var totals = CalculateTotals(order);
        return Format(order, totals);
    }

    private static void Validate(Order order)
    {
        if (order.Lines.Count == 0)
        {
            throw new ArgumentException("The order has no lines");
        }

        var invalid = order.Lines.FirstOrDefault(l => l.Quantity <= 0);
        if (invalid is not null)
        {
            throw new ArgumentException($"Invalid quantity for {invalid.Sku}");
        }
    }

    // REFACTOR: Replace Temp with Query / Extract Method for each business rule.
    public static ReceiptTotals CalculateTotals(Order order)
    {
        var subtotal = order.Lines.Sum(l => l.Amount);
        var discount = Discount(order.IsVip, subtotal);
        var taxable = subtotal - discount;
        var tax = Math.Round(taxable * TaxRate(order.Country), 2);
        var shipping = taxable >= FreeShippingThreshold ? 0m : StandardShipping;
        return new ReceiptTotals(subtotal, discount, tax, shipping);
    }

    private static decimal Discount(bool isVip, decimal subtotal) => (isVip, subtotal) switch
    {
        (true, _) => subtotal * 0.10m,
        (false, > 100m) => subtotal * 0.05m,
        _ => 0m,
    };

    private static decimal TaxRate(string country) => country switch
    {
        "ES" => 0.21m,
        "PT" => 0.23m,
        _ => 0m,
    };

    private static string Format(Order order, ReceiptTotals t)
    {
        var c = CultureInfo.InvariantCulture;
        var sb = new StringBuilder();
        sb.AppendLine(c, $"Customer: {order.CustomerName}");
        foreach (var line in order.Lines)
        {
            sb.AppendLine(string.Format(c, "{0} x{1} {2:0.00}", line.Sku, line.Quantity, line.Amount));
        }

        sb.AppendLine(string.Format(c, "Subtotal: {0:0.00}", t.Subtotal));
        sb.AppendLine(string.Format(c, "Discount: {0:0.00}", t.Discount));
        sb.AppendLine(string.Format(c, "VAT: {0:0.00}", t.Tax));
        sb.AppendLine(string.Format(c, "Shipping: {0:0.00}", t.Shipping));
        sb.Append(string.Format(c, "Total: {0:0.00}", t.Total));
        return sb.ToString();
    }
}
