namespace CodeSmells.General.CallbackHell.Smelly;

public sealed record Customer(int Id, string Email);
public sealed record Order(int Id, decimal Amount);

public class OrderSummaryService
{
    // Simulated callback-based I/O operations (old APM/EAP style).
    private static void LoadCustomer(int id, Action<Customer> onSuccess, Action<Exception> onError) =>
        Task.Run(() => { if (id <= 0) onError(new ArgumentException("bad id")); else onSuccess(new Customer(id, $"c{id}@shop.test")); });

    private static void LoadOrders(Customer customer, Action<IReadOnlyList<Order>> onSuccess, Action<Exception> onError) =>
        Task.Run(() => onSuccess(new[] { new Order(1, 10m * customer.Id), new Order(2, 5m) }));

    private static void LoadDiscount(Customer customer, Action<decimal> onSuccess, Action<Exception> onError) =>
        Task.Run(() => onSuccess(customer.Id % 2 == 0 ? 0.1m : 0m));

    // SMELL: a pyramid of nested callbacks. The real flow (customer -> orders -> discount -> total)
    //        is buried in indentation, and error handling is repeated at every level.
    public void GetSummary(int customerId, Action<string> onDone, Action<Exception> onError)
    {
        LoadCustomer(customerId, customer =>
        {
            LoadOrders(customer, orders =>
            {
                LoadDiscount(customer, discount =>
                {
                    try
                    {
                        var total = orders.Sum(o => o.Amount) * (1 - discount);
                        onDone($"{customer.Email}: {orders.Count} orders, {total:0.00}");
                    }
                    catch (Exception ex)
                    {
                        onError(ex);
                    }
                }, onError);
            }, onError);
        }, onError);
    }
}
