namespace CodeSmells.General.CallbackHell.Refactored;

public sealed record Customer(int Id, string Email);
public sealed record Order(int Id, decimal Amount);

public class OrderSummaryService
{
    // REFACTOR: operations return Task<T> instead of accepting callbacks.
    private static async Task<Customer> LoadCustomerAsync(int id)
    {
        await Task.Yield();
        return id <= 0 ? throw new ArgumentException("bad id") : new Customer(id, $"c{id}@shop.test");
    }

    private static Task<IReadOnlyList<Order>> LoadOrdersAsync(Customer customer) =>
        Task.FromResult<IReadOnlyList<Order>>(new[] { new Order(1, 10m * customer.Id), new Order(2, 5m) });

    private static Task<decimal> LoadDiscountAsync(Customer customer) =>
        Task.FromResult(customer.Id % 2 == 0 ? 0.1m : 0m);

    // REFACTOR: async/await flattens the pyramid: the code reads in the order things happen and errors
    //           propagate on their own as exceptions (a single try/catch in the caller, if needed).
    //           Orders and discount are independent, so they are also requested concurrently.
    public async Task<string> GetSummaryAsync(int customerId)
    {
        var customer = await LoadCustomerAsync(customerId);
        var ordersTask = LoadOrdersAsync(customer);
        var discountTask = LoadDiscountAsync(customer);

        var orders = await ordersTask;
        var discount = await discountTask;

        var total = orders.Sum(o => o.Amount) * (1 - discount);
        return $"{customer.Email}: {orders.Count} orders, {total:0.00}";
    }
}
