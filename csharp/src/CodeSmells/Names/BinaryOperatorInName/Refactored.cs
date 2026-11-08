namespace CodeSmells.Names.BinaryOperatorInName.Refactored;

public sealed record Order(int Id, string CustomerEmail, decimal Amount);

// REFACTOR: Split Function: each responsibility in its own type/method, with a name without "And".
public static class OrderValidator
{
    public static IReadOnlyList<string> Validate(Order order)
    {
        var errors = new List<string>();
        if (!order.CustomerEmail.Contains('@'))
        {
            errors.Add("Invalid email");
        }

        if (order.Amount <= 0)
        {
            errors.Add("Amount must be positive");
        }

        return errors;
    }
}

public class OrderRepository
{
    public List<Order> Saved { get; } = new();
    public void Save(Order order) => Saved.Add(order);
}

// REFACTOR: the use case orchestrates both pieces; its name describes the business intent.
public class PlaceOrderHandler(OrderRepository repository)
{
    public IReadOnlyList<string> Handle(Order order)
    {
        var errors = OrderValidator.Validate(order);
        if (errors.Count == 0)
        {
            repository.Save(order);
        }
        return errors;
    }
}
