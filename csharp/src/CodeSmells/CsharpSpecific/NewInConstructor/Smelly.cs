namespace CodeSmells.CsharpSpecific.NewInConstructor.Smelly;

public sealed record Order(int Id, string CustomerEmail, decimal Amount);

// Concrete "infrastructure" (simulated in memory so the example runs anywhere).
public class SqlOrderRepository
{
    public static readonly List<Order> Table = new(); // pretends to be a real database table
    public void Save(Order order) { lock (Table) Table.Add(order); }
}

public class SmtpEmailSender
{
    public static readonly List<string> Outbox = new(); // pretends to be a real SMTP server
    public void Send(string to, string body) { lock (Outbox) Outbox.Add($"{to}|{body}"); }
}

public class OrderProcessor
{
    private readonly SqlOrderRepository _repository;
    private readonly SmtpEmailSender _emailSender;

    // SMELL: "control freak". The class creates its own collaborators with new: it is welded to SQL and
    //        SMTP, it cannot be reused with other implementations, and tests cannot replace them with fakes;
    //        they can only check side effects in the "real" (here: global) infrastructure.
    public OrderProcessor()
    {
        _repository = new SqlOrderRepository();
        _emailSender = new SmtpEmailSender();
    }

    public bool Process(Order order)
    {
        if (order.Amount <= 0) return false;
        _repository.Save(order);
        _emailSender.Send(order.CustomerEmail, $"Order {order.Id} received");
        return true;
    }
}
