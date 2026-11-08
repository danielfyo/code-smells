using System.Globalization;

namespace CodeSmells.Couplers.ArtificialCoupling.Smelly;

public sealed class OrderService
{
    // SMELL: Artificial Coupling. General-purpose constants (date format, retries) declared inside
    // a concrete order class. Whoever only needs the date format (invoice exporter, reports)
    // ends up depending on OrderService.
    public const string DateFormat = "yyyy-MM-dd";
    public const int MaxRetries = 3;

    public string Describe(string orderId, DateTime placedAt) =>
        $"Order {orderId} placed on {placedAt.ToString(DateFormat, CultureInfo.InvariantCulture)}";
}

public sealed class InvoiceExporter
{
    public string ExportLine(string invoiceId, DateTime issuedAt, decimal total) =>
        string.Create(CultureInfo.InvariantCulture,
            $"{invoiceId};{issuedAt.ToString(OrderService.DateFormat, CultureInfo.InvariantCulture)};{total:0.00}");

    public int RetriesForUpload() => OrderService.MaxRetries; // nothing to do with orders
}
