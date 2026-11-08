namespace CodeSmells.ErrorHandling.ExceptionsForControlFlow.Smelly;

public sealed class StockImporter(Dictionary<string, int> stock)
{
    // SMELL: Exceptions for Control Flow. A malformed line or an unknown SKU are expected cases
    // in an import file, yet they are handled by throwing and catching exceptions
    // (FormatException, KeyNotFoundException). It is slow, hides intent and may swallow real
    // errors that have nothing to do with the input.
    public (int Applied, int Rejected) Import(IEnumerable<string> lines)
    {
        int applied = 0, rejected = 0;
        foreach (var line in lines)
        {
            try
            {
                var parts = line.Split(',');
                var sku = parts[0];
                var delta = int.Parse(parts[1]);  // IndexOutOfRange / FormatException
                var current = stock[sku];         // KeyNotFoundException
                stock[sku] = current + delta;
                applied++;
            }
            catch (Exception)
            {
                rejected++;
            }
        }
        return (applied, rejected);
    }
}
