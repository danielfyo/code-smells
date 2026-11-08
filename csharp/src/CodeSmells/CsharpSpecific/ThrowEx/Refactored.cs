using System.Globalization;
using System.Runtime.CompilerServices;

namespace CodeSmells.CsharpSpecific.ThrowEx.Refactored;

public class PaymentImporter
{
    public List<string> Log { get; } = new();

    public decimal ImportAmount(string raw)
    {
        try
        {
            return ParseAmount(raw);
        }
        catch (FormatException)
        {
            Log.Add($"Invalid amount: {raw}");
            // REFACTOR: "throw;" rethrows the SAME exception, preserving the original stack trace.
            //           (To add context: throw new ImportException("...", ex); keeping it as InnerException.)
            throw;
        }
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    private static decimal ParseAmount(string raw) => decimal.Parse(raw, CultureInfo.InvariantCulture);
}
