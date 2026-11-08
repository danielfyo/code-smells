using S = CodeSmells.Names.InconsistentNames.Smelly;
using R = CodeSmells.Names.InconsistentNames.Refactored;

namespace CodeSmells.Tests.Names;

public class InconsistentNamesTests
{
    [Fact]
    public void Both_repository_sets_return_the_same_data()
    {
        var smellyClients = new S.ClientRepository(new[] { new S.Customer(1, "Ana") });
        var smellyOrders = new S.OrderRepository(new[] { new S.Order(10, 1, 50m), new S.Order(11, 2, 5m) });
        var smellyInvoices = new S.InvoiceRepository(new[] { new S.Invoice("F-1", 1) });

        var customers = new R.CustomerRepository(new[] { new R.Customer(1, "Ana") });
        var orders = new R.OrderRepository(new[] { new R.Order(10, 1, 50m), new R.Order(11, 2, 5m) });
        var invoices = new R.InvoiceRepository(new[] { new R.Invoice("F-1", 1) });

        Assert.Equal(smellyClients.FetchClient(1)?.Name, customers.GetById(1)?.Name);
        Assert.Equal(smellyOrders.GetOrdersForCustomer(1).Select(o => o.Id), orders.GetByCustomerId(1).Select(o => o.Id));
        Assert.Equal(smellyInvoices.RetrieveByBuyer(1).Select(i => i.Number), invoices.GetByCustomerId(1).Select(i => i.Number));
        Assert.Null(customers.GetById(99));
    }
}
