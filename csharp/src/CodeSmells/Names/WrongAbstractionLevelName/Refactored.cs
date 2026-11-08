namespace CodeSmells.Names.WrongAbstractionLevelName.Refactored;

// REFACTOR: Rename Method/Interface: the name describes the concept (notifying a customer),
//           not the mechanism. SMTP, SMS or push are details of each implementation.
public interface ICustomerNotifier
{
    void Notify(string customerContact, string message);
}

public class OrderService(ICustomerNotifier notifier)
{
    public void ConfirmOrder(string customerContact, int orderId) =>
        notifier.Notify(customerContact, $"Your order #{orderId} is confirmed");
}

// REFACTOR: the "email" detail only shows up in the name of the concrete implementation.
public class RecordingEmailNotifier : ICustomerNotifier
{
    public List<(string To, string Body)> Sent { get; } = new();
    public void Notify(string customerContact, string message) => Sent.Add((customerContact, message));
}
