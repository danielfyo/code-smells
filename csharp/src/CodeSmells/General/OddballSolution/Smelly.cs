using System.Globalization;

namespace CodeSmells.General.OddballSolution.Smelly;

public class CustomerImporter
{
    // Way #1: ParseExact with the invariant culture.
    public DateOnly ParseSignupDate(string raw) =>
        DateOnly.ParseExact(raw, "dd/MM/yyyy", CultureInfo.InvariantCulture);
}

public class OrderImporter
{
    // SMELL: the SAME problem (parsing dd/MM/yyyy dates from the import file) solved in a different way:
    //        a manual Split. It behaves differently on odd input and forces readers to know two solutions.
    public DateOnly ParseOrderDate(string raw)
    {
        var parts = raw.Split('/');
        return new DateOnly(int.Parse(parts[2]), int.Parse(parts[1]), int.Parse(parts[0]));
    }
}

public class InvoiceImporter
{
    // SMELL: and a third variant, depending on a specific culture.
    public DateOnly ParseInvoiceDate(string raw) =>
        DateOnly.FromDateTime(DateTime.Parse(raw, new CultureInfo("es-ES")));
}
