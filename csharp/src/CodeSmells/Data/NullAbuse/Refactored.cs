namespace CodeSmells.Data.NullAbuse.Refactored;

// REFACTOR: Introduce Special Case (Null Object) + never-null collections. The "unknown
// customer" is an object with default behavior: the caller no longer asks about null.
public record Customer(string Id, string Name, IReadOnlyList<string> Orders, string? Coupon = null)
{
    public virtual string CouponNote => Coupon is null ? "" : $" You have coupon {Coupon}.";
}

public sealed record GuestCustomer() : Customer("", "guest", [])
{
    public static readonly GuestCustomer Instance = new();
}

public sealed class CustomerRepository
{
    private readonly Dictionary<string, Customer> _data = new();
    public void Add(Customer c) => _data[c.Id] = c;

    // REFACTOR: the contract guarantees a non-null value.
    public Customer FindOrGuest(string id) => _data.GetValueOrDefault(id) ?? GuestCustomer.Instance;
}

public sealed class GreetingService(CustomerRepository repository)
{
    public string Greeting(string customerId)
    {
        var customer = repository.FindOrGuest(customerId);
        return customer is GuestCustomer
            ? "Hello, guest"
            : $"Hello, {customer.Name}. Orders: {customer.Orders.Count}.{customer.CouponNote}";
    }

    public int OrderCount(string customerId) => repository.FindOrGuest(customerId).Orders.Count;
}
