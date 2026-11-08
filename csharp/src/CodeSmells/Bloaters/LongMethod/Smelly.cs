using System.Globalization;
using System.Text;

namespace CodeSmells.Bloaters.LongMethod.Smelly;

public sealed class OrderLine
{
    public string Sku { get; set; } = "";
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public sealed class Order
{
    public string CustomerName { get; set; } = "";
    public bool IsVip { get; set; }
    public string Country { get; set; } = "ES";
    public List<OrderLine> Lines { get; } = new();
}

/// <summary>Builds the receipt of an order: everything in a single gigantic method.</summary>
public sealed class ReceiptService
{
    // SMELL: Long Method. This method validates, computes subtotal, discounts, taxes, shipping and
    // also formats the receipt. Each block is a different responsibility separated only by
    // comments; to understand any detail you have to read all 50 lines.
    public string BuildReceipt(Order order)
    {
        // validation
        if (order.Lines.Count == 0)
            throw new ArgumentException("The order has no lines");
        foreach (var line in order.Lines)
        {
            if (line.Quantity <= 0)
                throw new ArgumentException($"Invalid quantity for {line.Sku}");
        }

        // subtotal
        decimal subtotal = 0;
        foreach (var line in order.Lines)
        {
            subtotal += line.Quantity * line.UnitPrice;
        }

        // discount
        decimal discount = 0;
        if (order.IsVip)
            discount = subtotal * 0.10m;
        else if (subtotal > 100)
            discount = subtotal * 0.05m;

        // taxes
        decimal taxRate;
        if (order.Country == "ES") taxRate = 0.21m;
        else if (order.Country == "PT") taxRate = 0.23m;
        else taxRate = 0m;
        var tax = Math.Round((subtotal - discount) * taxRate, 2);

        // shipping
        decimal shipping = subtotal - discount >= 50 ? 0 : 4.99m;

        var total = subtotal - discount + tax + shipping;

        // formatting
        // SMELL: low-level detail (StringBuilder, formats) lives next to business rules.
        var sb = new StringBuilder();
        var c = CultureInfo.InvariantCulture;
        sb.AppendLine($"Customer: {order.CustomerName}");
        foreach (var line in order.Lines)
            sb.AppendLine(string.Format(c, "{0} x{1} {2:0.00}", line.Sku, line.Quantity, line.Quantity * line.UnitPrice));
        sb.AppendLine(string.Format(c, "Subtotal: {0:0.00}", subtotal));
        sb.AppendLine(string.Format(c, "Discount: {0:0.00}", discount));
        sb.AppendLine(string.Format(c, "VAT: {0:0.00}", tax));
        sb.AppendLine(string.Format(c, "Shipping: {0:0.00}", shipping));
        sb.Append(string.Format(c, "Total: {0:0.00}", total));
        return sb.ToString();
    }
}
