using System.Globalization;

namespace CodeSmells.Couplers.ArtificialCoupling.Refactored;

// REFACTOR: Move Field. Each constant moves to where it conceptually belongs; classes that do
// not need each other stop depending on one another.
public static class DateFormats
{
    public const string Iso = "yyyy-MM-dd";
    public static string ToIso(DateTime date) => date.ToString(Iso, CultureInfo.InvariantCulture);
}

public static class RetryPolicy
{
    public const int DefaultMaxRetries = 3;
}

public sealed class OrderService
{
    public string Describe(string orderId, DateTime placedAt) => $"Order {orderId} placed on {DateFormats.ToIso(placedAt)}";
}

public sealed class InvoiceExporter
{
    public string ExportLine(string invoiceId, DateTime issuedAt, decimal total) =>
        string.Create(CultureInfo.InvariantCulture, $"{invoiceId};{DateFormats.ToIso(issuedAt)};{total:0.00}");

    public int RetriesForUpload() => RetryPolicy.DefaultMaxRetries;
}
