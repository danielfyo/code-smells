namespace CodeSmells.Names.InconsistentNames.Smelly;

public sealed record Customer(int Id, string Name);
public sealed record Order(int Id, int CustomerId, decimal Amount);
public sealed record Invoice(string Number, int CustomerId);

// SMELL: the same concept (customer) is called "Client", "Customer" and "Buyer";
//        the same operation (get) is called "Fetch", "Get" and "Retrieve".
//        The reader wonders whether they are different things, and autocomplete does not help.
public class ClientRepository(IEnumerable<Customer> data)
{
    public Customer? FetchClient(int clientId) => data.FirstOrDefault(c => c.Id == clientId);
}

public class OrderRepository(IEnumerable<Order> data)
{
    public IReadOnlyList<Order> GetOrdersForCustomer(int customerId) =>
        data.Where(o => o.CustomerId == customerId).ToList();
}

public class InvoiceRepository(IEnumerable<Invoice> data)
{
    public IReadOnlyList<Invoice> RetrieveByBuyer(int buyerId) =>
        data.Where(i => i.CustomerId == buyerId).ToList();
}
