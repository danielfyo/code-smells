using System.Globalization;
using System.Runtime.CompilerServices;

namespace CodeSmells.CsharpSpecific.ThrowEx.Smelly;

public class PaymentImporter
{
    public List<string> Log { get; } = new();

    public decimal ImportAmount(string raw)
    {
        try
        {
            return ParseAmount(raw);
        }
        catch (FormatException ex)
        {
            Log.Add($"Invalid amount: {raw}");
            // SMELL: "throw ex" rethrows the exception as if it originated HERE: the stack trace
            //        is reset and ParseAmount (the real origin of the error) disappears from it.
            throw ex;
        }
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    private static decimal ParseAmount(string raw) => decimal.Parse(raw, CultureInfo.InvariantCulture);
}
