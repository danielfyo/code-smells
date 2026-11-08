namespace CodeSmells.Data.NullAbuse.Smelly;

public sealed class Customer
{
    public string Id { get; init; } = "";
    public string Name { get; init; } = "";
    public string? Coupon { get; init; }
    public List<string>? Orders { get; init; }
}

public sealed class CustomerRepository
{
    private readonly Dictionary<string, Customer> _data = new();
    public void Add(Customer c) => _data[c.Id] = c;

    // SMELL: Null Abuse. Returns null when the customer is not found; every caller must
    // remember it. Collections can also be null instead of empty.
    public Customer? Find(string id) => _data.TryGetValue(id, out var c) ? c : null;
}

public sealed class GreetingService(CustomerRepository repository)
{
    // SMELL: cascading null checks that hide the real logic.
    public string Greeting(string customerId)
    {
        var customer = repository.Find(customerId);
        if (customer == null) return "Hello, guest";
        string name = customer.Name != null ? customer.Name : "guest";
        int orders = customer.Orders != null ? customer.Orders.Count : 0;
        string extra = customer.Coupon != null ? $" You have coupon {customer.Coupon}." : "";
        return $"Hello, {name}. Orders: {orders}.{extra}";
    }

    public int OrderCount(string customerId) => repository.Find(customerId)!.Orders!.Count; // NRE waiting to happen
}
