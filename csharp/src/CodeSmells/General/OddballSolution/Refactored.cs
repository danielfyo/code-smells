using System.Globalization;

namespace CodeSmells.General.OddballSolution.Refactored;

// REFACTOR: Substitute Algorithm + Extract Class: one single, named way to solve the problem.
//           Every importer uses it, so they behave the same and are fixed in one place.
public static class ImportDates
{
    public const string Format = "dd/MM/yyyy";

    public static DateOnly Parse(string raw) =>
        DateOnly.ParseExact(raw.Trim(), Format, CultureInfo.InvariantCulture);
}

public class CustomerImporter
{
    public DateOnly ParseSignupDate(string raw) => ImportDates.Parse(raw);
}

public class OrderImporter
{
    public DateOnly ParseOrderDate(string raw) => ImportDates.Parse(raw);
}

public class InvoiceImporter
{
    public DateOnly ParseInvoiceDate(string raw) => ImportDates.Parse(raw);
}
