namespace CodeSmells.OoAbusers.AlternativeClassesDifferentInterfaces.Refactored;

public sealed record Customer(string Name, string? Email = null, string? Phone = null);

public sealed record Notification(string Subject, string Body);

// REFACTOR: Rename Method + Change Function Declaration + Extract Interface. Both classes are
// aligned behind a common interface and become interchangeable.
public interface INotificationChannel
{
    bool CanReach(Customer customer);
    void Send(Customer customer, Notification notification);
}

public sealed class EmailChannel : INotificationChannel
{
    public List<string> Outbox { get; } = new();
    public bool CanReach(Customer customer) => customer.Email is not null;
    public void Send(Customer customer, Notification notification) =>
        Outbox.Add($"EMAIL to={customer.Email} subject={notification.Subject} body={notification.Body}");
}

public sealed class SmsChannel : INotificationChannel
{
    public List<string> Log { get; } = new();
    public bool CanReach(Customer customer) => customer.Phone is not null;
    public void Send(Customer customer, Notification notification) =>
        Log.Add($"SMS to={customer.Phone} text={notification.Body}");
}

public sealed class ShipmentNotifier(IReadOnlyList<INotificationChannel> channelsByPreference)
{
    public void NotifyDispatched(Customer customer, string trackingCode)
    {
        var notification = new Notification("Order shipped", $"Hi {customer.Name}, your order is on its way ({trackingCode})");
        channelsByPreference.FirstOrDefault(c => c.CanReach(customer))?.Send(customer, notification);
    }
}
