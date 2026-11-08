namespace CodeSmells.Names.EncodingsInNames.Refactored;

// REFACTOR: Rename: no type or scope prefixes. The "I" of interfaces is kept because it is the
//           standard .NET convention, but without the redundant "Interface" suffix.
public interface ICustomer
{
    string FullName { get; }
}

public class Customer(string firstName, string lastName, bool isActive) : ICustomer
{
    private readonly List<decimal> _orderAmounts = new();

    // REFACTOR: properties instead of GetX(); the underscore for private fields is the .NET convention.
    public bool IsActive { get; } = isActive;
    public string FullName => $"{firstName} {lastName}";
    public decimal TotalSpent => _orderAmounts.Sum();
    public int OrderCount => _orderAmounts.Count;

    public void AddOrder(decimal amount) => _orderAmounts.Add(amount);
}
