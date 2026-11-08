namespace CodeSmells.Names.BinaryOperatorInName.Smelly;

public sealed record Order(int Id, string CustomerEmail, decimal Amount);

public class OrderService
{
    public List<Order> Saved { get; } = new();

    // SMELL: the "And" in the name gives away two responsibilities in one function.
    //        There is no way to validate without saving (e.g. for a preview), nor to save
    //        something already validated without validating it again.
    public IReadOnlyList<string> ValidateAndSave(Order order)
    {
        var errors = new List<string>();
        if (!order.CustomerEmail.Contains('@')) errors.Add("Invalid email");
        if (order.Amount <= 0) errors.Add("Amount must be positive");

        if (errors.Count == 0)
        {
            Saved.Add(order);
        }
        return errors;
    }
}
