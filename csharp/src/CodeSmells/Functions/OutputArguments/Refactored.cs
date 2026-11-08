namespace CodeSmells.Functions.OutputArguments.Refactored;

public sealed record CartLine(string Sku, int Quantity, decimal UnitPrice, int Stock)
{
    public decimal Amount => Quantity * UnitPrice;
    public bool ExceedsStock => Quantity > Stock;
}

/// <summary>Complete result of the calculation, returned as a value.</summary>
public sealed record CartSummary(decimal Subtotal, int Units, IReadOnlyList<string> Warnings);

public static class CartPricing
{
    // REFACTOR: Replace Output Parameters with Return Value (record). All output travels in the
    // return value; the function is pure and its signature says exactly what goes in and out.
    public static CartSummary Calculate(IReadOnlyCollection<CartLine> lines) => new(
        lines.Sum(l => l.Amount),
        lines.Sum(l => l.Quantity),
        lines.Where(l => l.ExceedsStock).Select(l => $"{l.Sku}: only {l.Stock} left").ToList());
}
