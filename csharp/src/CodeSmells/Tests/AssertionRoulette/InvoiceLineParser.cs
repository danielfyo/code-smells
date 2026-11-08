using System.Globalization;

namespace CodeSmells.Tests.AssertionRoulette;

// Production code. The "Assertion Roulette" smell lives in tests/CodeSmells.Tests/Tests/AssertionRoulette/.
public sealed record InvoiceLine(string Sku, string Description, int Quantity, decimal UnitPrice, decimal Total);

public static class InvoiceLineParser
{
    // Format: SKU;Description;Quantity;UnitPrice
    public static InvoiceLine Parse(string line)
    {
        var parts = line.Split(';');
        var quantity = int.Parse(parts[2], CultureInfo.InvariantCulture);
        var unitPrice = decimal.Parse(parts[3], CultureInfo.InvariantCulture);
        return new InvoiceLine(parts[0].Trim(), parts[1].Trim(), quantity, unitPrice, quantity * unitPrice);
    }
}
