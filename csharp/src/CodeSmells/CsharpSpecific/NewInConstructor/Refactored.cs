namespace CodeSmells.CsharpSpecific.NewInConstructor.Refactored;

public sealed record Order(int Id, string CustomerEmail, decimal Amount);

// REFACTOR: depend on abstractions (Dependency Inversion) ...
public interface IOrderRepository { void Save(Order order); }
public interface IEmailSender { void Send(string to, string body); }

// ... and receive them through the constructor (Dependency Injection). Which implementation to use
// (SQL, SMTP, in-memory fakes) is decided by the composition root or by the test.
public class OrderProcessor(IOrderRepository repository, IEmailSender emailSender)
{
    public bool Process(Order order)
    {
        if (order.Amount <= 0) return false;
        repository.Save(order);
        emailSender.Send(order.CustomerEmail, $"Order {order.Id} received");
        return true;
    }
}
