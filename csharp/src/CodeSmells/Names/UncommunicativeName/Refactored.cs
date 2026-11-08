namespace CodeSmells.Names.UncommunicativeName.Refactored;

// REFACTOR: Rename (class, method, parameters and variables) + Replace Array with Object:
//           the decimal[] array becomes a record with named properties.
public sealed record OrderLine(decimal UnitPrice, decimal Quantity, decimal DiscountRate)
{
    public decimal Subtotal => UnitPrice * Quantity * (1 - DiscountRate);
}

public static class InvoiceCalculator
{
    public static decimal CalculateTotalWithTax(IEnumerable<OrderLine> lines, decimal taxRate)
    {
        var netTotal = lines
            .Where(line => line.Quantity > 0)
            .Sum(line => line.Subtotal);

        return Math.Round(netTotal * (1 + taxRate), 2);
    }
}
