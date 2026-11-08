namespace CodeSmells.General.MisplacedResponsibility.Smelly;

public sealed record InvoiceLine(string Description, decimal UnitPrice, int Quantity);

public class Invoice
{
    public List<InvoiceLine> Lines { get; } = new();
    public bool IsWholesaleCustomer { get; init; }
}

public class InvoicePrinter
{
    // SMELL: the total calculation (an invoice business rule) lives in the class that PRINTS,
    //        because that is where the author needed it. Anyone looking for "how the total is computed"
    //        will look in Invoice and not find it; and the next person who needs it will duplicate it.
    public string Print(Invoice invoice)
    {
        var subtotal = invoice.Lines.Sum(l => l.UnitPrice * l.Quantity);
        var discount = invoice.IsWholesaleCustomer && subtotal > 500m ? subtotal * 0.05m : 0m;
        var total = Math.Round((subtotal - discount) * 1.21m, 2);

        var body = string.Join("\n", invoice.Lines.Select(l => $"{l.Description} x{l.Quantity}"));
        return $"{body}\nTOTAL: {total:0.00}";
    }
}
