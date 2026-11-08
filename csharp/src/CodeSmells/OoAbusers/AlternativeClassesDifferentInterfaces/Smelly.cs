namespace CodeSmells.OoAbusers.AlternativeClassesDifferentInterfaces.Smelly;

// SMELL: Alternative Classes with Different Interfaces. Both classes "send a notice to a
// customer", but with different method names, parameter order and types. They cannot be
// swapped and the client needs a specific branch for each one.
public sealed class EmailSender
{
    public List<string> Outbox { get; } = new();
    public bool SendEmail(string toAddress, string subject, string htmlBody)
    {
        Outbox.Add($"EMAIL to={toAddress} subject={subject} body={htmlBody}");
        return true;
    }
}

public sealed class SmsGateway
{
    public List<string> Log { get; } = new();
    public void Transmit(string text, string phoneNumber) => Log.Add($"SMS to={phoneNumber} text={text}");
}

public sealed class Customer
{
    public string Name { get; init; } = "";
    public string? Email { get; init; }
    public string? Phone { get; init; }
}

public sealed class ShipmentNotifier(EmailSender email, SmsGateway sms)
{
    public void NotifyDispatched(Customer customer, string trackingCode)
    {
        var message = $"Hi {customer.Name}, your order is on its way ({trackingCode})";
        // SMELL: the client must know every concrete API.
        if (customer.Email is not null)
            email.SendEmail(customer.Email, "Order shipped", message);
        else if (customer.Phone is not null)
            sms.Transmit(message, customer.Phone);
    }
}
