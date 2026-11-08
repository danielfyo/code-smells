namespace CodeSmells.General.MisplacedResponsibility.Refactored;

public sealed record InvoiceLine(string Description, decimal UnitPrice, int Quantity)
{
    public decimal Subtotal => UnitPrice * Quantity;
}

// REFACTOR: Move Method: the amount rules live in Invoice, where any reader would look for them
//           and where printing, PDF export, the API or accounting can reuse them.
public class Invoice
{
    private const decimal VatRate = 0.21m;
    private const decimal WholesaleDiscountRate = 0.05m;
    private const decimal WholesaleDiscountThreshold = 500m;

    public List<InvoiceLine> Lines { get; } = new();
    public bool IsWholesaleCustomer { get; init; }

    public decimal Subtotal => Lines.Sum(l => l.Subtotal);

    public decimal Discount =>
        IsWholesaleCustomer && Subtotal > WholesaleDiscountThreshold ? Subtotal * WholesaleDiscountRate : 0m;

    public decimal Total => Math.Round((Subtotal - Discount) * (1 + VatRate), 2);
}

// REFACTOR: the printer only deals with presentation.
public class InvoicePrinter
{
    public string Print(Invoice invoice)
    {
        var body = string.Join("\n", invoice.Lines.Select(l => $"{l.Description} x{l.Quantity}"));
        return $"{body}\nTOTAL: {invoice.Total:0.00}";
    }
}
