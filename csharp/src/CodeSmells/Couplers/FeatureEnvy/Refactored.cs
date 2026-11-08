namespace CodeSmells.Couplers.FeatureEnvy.Refactored;

// REFACTOR: Move Method. The rule moves to the class whose data it uses; Customer could even keep
// its details private and expose only the decision.
public sealed record Customer(string Name, int YearsAsCustomer, decimal SpentLastYear, bool IsEmployee, int ReturnedOrders)
{
    public decimal DiscountRate()
    {
        if (IsEmployee)
        {
            return 0.30m;
        }

        var rate = (YearsAsCustomer >= 5 ? 0.05m : 0m)
                 + (SpentLastYear > 1000m ? 0.05m : 0m)
                 - (ReturnedOrders > 3 ? 0.03m : 0m);
        return Math.Max(rate, 0m);
    }
}

public sealed class DiscountService
{
    public decimal ApplyDiscount(Customer customer, decimal amount) => amount * (1 - customer.DiscountRate());
}
