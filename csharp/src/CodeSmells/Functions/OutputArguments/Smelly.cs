namespace CodeSmells.Functions.OutputArguments.Smelly;

public sealed record CartLine(string Sku, int Quantity, decimal UnitPrice, int Stock);

public static class CartPricing
{
    // SMELL: Output Arguments. The function "returns" three results through two 'out' parameters
    // and a list the caller must create and pass in to be filled. The signature does not read
    // naturally (is 'warnings' input or output?) and forces variables to be declared up front.
    public static void Calculate(IEnumerable<CartLine> lines, out decimal subtotal, out int units, List<string> warnings)
    {
        subtotal = 0;
        units = 0;
        foreach (var line in lines)
        {
            subtotal += line.Quantity * line.UnitPrice;
            units += line.Quantity;
            if (line.Quantity > line.Stock)
                warnings.Add($"{line.Sku}: only {line.Stock} left");
        }
    }
}
