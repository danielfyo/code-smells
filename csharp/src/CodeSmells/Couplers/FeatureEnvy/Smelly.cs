namespace CodeSmells.Couplers.FeatureEnvy.Smelly;

public sealed class Customer
{
    public string Name { get; init; } = "";
    public int YearsAsCustomer { get; init; }
    public decimal SpentLastYear { get; init; }
    public bool IsEmployee { get; init; }
    public int ReturnedOrders { get; init; }
}

public sealed class DiscountService
{
    // SMELL: Feature Envy. This method barely uses anything from DiscountService: it queries five
    // pieces of Customer data to decide something that is the customer's own knowledge. If
    // Customer's properties change, this class changes.
    public decimal DiscountRateFor(Customer customer)
    {
        if (customer.IsEmployee) return 0.30m;
        var rate = 0m;
        if (customer.YearsAsCustomer >= 5) rate += 0.05m;
        if (customer.SpentLastYear > 1000m) rate += 0.05m;
        if (customer.ReturnedOrders > 3) rate -= 0.03m;
        return Math.Max(rate, 0m);
    }

    public decimal ApplyDiscount(Customer customer, decimal amount) => amount * (1 - DiscountRateFor(customer));
}
