namespace CodeSmells.Data.BooleanBlindness.Refactored;

public sealed record Invoice(string Number, string CustomerEmail, decimal Total);

// REFACTOR: Replace Boolean with Enum / Introduce Parameter Object. Each option has its own name
// and the call site reads by itself: new SendOptions(Priority.Urgent, Attachment.Pdf, ...).
public enum Priority { Normal, Urgent }
public enum Attachment { None, Pdf }
public enum AccountingCopy { No, Yes }
public enum PaymentStatus { OnTime, Overdue }

public sealed record SendOptions(
    Priority Priority = Priority.Normal,
    Attachment Attachment = Attachment.None,
    AccountingCopy AccountingCopy = AccountingCopy.No);

public sealed class InvoiceMailer
{
    private const string AccountingEmail = "accounting@company.test";
    public List<string> Sent { get; } = new();

    public void Send(Invoice invoice, SendOptions options)
    {
        var subject = (options.Priority == Priority.Urgent ? "[URGENT] " : "") + $"Invoice {invoice.Number}";
        var attachment = options.Attachment == Attachment.Pdf ? $"{invoice.Number}.pdf" : "none";
        Sent.Add($"to={invoice.CustomerEmail};subject={subject};attachment={attachment}");
        if (options.AccountingCopy == AccountingCopy.Yes)
            Sent.Add($"to={AccountingEmail};subject={subject};attachment={attachment}");
    }

    // REFACTOR: Rename + return an enum instead of an anonymous bool.
    public PaymentStatus StatusOf(DateOnly dueDate, DateOnly today) =>
        today > dueDate ? PaymentStatus.Overdue : PaymentStatus.OnTime;
}
