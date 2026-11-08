namespace CodeSmells.Names.InconsistentNames.Refactored;

public sealed record Customer(int Id, string Name);
public sealed record Order(int Id, int CustomerId, decimal Amount);
public sealed record Invoice(string Number, int CustomerId);

// REFACTOR: a single vocabulary (ubiquitous language): "Customer" for the concept and "Get" for retrieval.
//           The three repositories read the same and can be guessed without looking at their code.
public class CustomerRepository(IEnumerable<Customer> data)
{
    public Customer? GetById(int customerId) => data.FirstOrDefault(c => c.Id == customerId);
}

public class OrderRepository(IEnumerable<Order> data)
{
    public IReadOnlyList<Order> GetByCustomerId(int customerId) =>
        data.Where(o => o.CustomerId == customerId).ToList();
}

public class InvoiceRepository(IEnumerable<Invoice> data)
{
    public IReadOnlyList<Invoice> GetByCustomerId(int customerId) =>
        data.Where(i => i.CustomerId == customerId).ToList();
}
