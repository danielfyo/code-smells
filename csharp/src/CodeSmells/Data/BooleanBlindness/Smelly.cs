namespace CodeSmells.Data.BooleanBlindness.Smelly;

public sealed record Invoice(string Number, string CustomerEmail, decimal Total);

public sealed class InvoiceMailer
{
    public List<string> Sent { get; } = new();

    // SMELL: Boolean Blindness. The call site reads Send(invoice, true, false, true): there is
    // no way to know what each boolean means without opening this method. Swapping them
    // compiles fine and produces a different delivery.
    public void Send(Invoice invoice, bool urgent, bool attachPdf, bool copyToAccounting)
    {
        var subject = (urgent ? "[URGENT] " : "") + $"Invoice {invoice.Number}";
        var attachment = attachPdf ? $"{invoice.Number}.pdf" : "none";
        Sent.Add($"to={invoice.CustomerEmail};subject={subject};attachment={attachment}");
        if (copyToAccounting)
            Sent.Add($"to=accounting@company.test;subject={subject};attachment={attachment}");
    }

    // SMELL: the returned bool does not say whether "true" means "paid" or "overdue" either.
    public bool Check(Invoice invoice, DateOnly dueDate, DateOnly today) => today > dueDate;
}
