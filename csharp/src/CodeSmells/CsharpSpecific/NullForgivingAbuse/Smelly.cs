namespace CodeSmells.CsharpSpecific.NullForgivingAbuse.Smelly;

public sealed record Customer(int Id, string Name, string? Email);

public class CustomerDirectory(IEnumerable<Customer> customers)
{
    private readonly List<Customer> _customers = customers.ToList();

    // SMELL: the "!" operator silences the compiler's nullability warnings without handling the null.
    //        Find can return null (unknown customer) and Email is declared nullable, yet the code promises
    //        "trust me, it's not null". The warning disappears and the NullReferenceException shows up
    //        in production, far away from the real cause.
    public string GetContactEmail(int customerId)
    {
        var customer = _customers.Find(c => c.Id == customerId)!;
        return customer.Email!.Trim().ToLowerInvariant();
    }
}
