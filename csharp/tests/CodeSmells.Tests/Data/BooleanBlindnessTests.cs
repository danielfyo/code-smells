using R = CodeSmells.Data.BooleanBlindness.Refactored;
using S = CodeSmells.Data.BooleanBlindness.Smelly;

namespace CodeSmells.Tests.Data;

public class BooleanBlindnessTests
{
    [Fact]
    public void Same_emails_are_sent()
    {
        var s = new S.InvoiceMailer();
        s.Send(new S.Invoice("F-7", "cli@shop.test", 10m), true, false, true);

        var r = new R.InvoiceMailer();
        r.Send(new R.Invoice("F-7", "cli@shop.test", 10m),
            new R.SendOptions(R.Priority.Urgent, R.Attachment.None, R.AccountingCopy.Yes));

        Assert.Equal(s.Sent, r.Sent);
    }

    [Fact]
    public void Overdue_check_matches()
    {
        var due = new DateOnly(2024, 1, 10);
        var late = due.AddDays(1);
        Assert.True(new S.InvoiceMailer().Check(new S.Invoice("F", "e", 1m), due, late));
        Assert.Equal(R.PaymentStatus.Overdue, new R.InvoiceMailer().StatusOf(due, late));
        Assert.Equal(R.PaymentStatus.OnTime, new R.InvoiceMailer().StatusOf(due, due));
    }
}
