namespace CodeSmells.CsharpSpecific.NullForgivingAbuse.Refactored;

public sealed record Customer(int Id, string Name, string? Email);

public class CustomerDirectory(IEnumerable<Customer> customers)
{
    private readonly List<Customer> _customers = customers.ToList();

    // REFACTOR: the absence of a value is part of the contract (string?) and it is handled explicitly
    //           with null-conditional operators / pattern matching. Callers are forced by the compiler
    //           to decide what to do when there is no email. "!" is kept for the rare cases where we
    //           truly know more than the compiler (and ideally with a comment explaining why).
    public string? FindContactEmail(int customerId) =>
        _customers.Find(c => c.Id == customerId) is { Email: { } email }
            ? email.Trim().ToLowerInvariant()
            : null;
}
