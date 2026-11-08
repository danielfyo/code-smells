namespace CodeSmells.General.MissingExplanatoryVariables.Smelly;

public sealed record Customer(DateOnly SignupDate, int OrdersLastYear, bool HasUnpaidInvoices);
public sealed record Cart(decimal Total, IReadOnlyList<string> Categories);

public static class FreeShippingPolicy
{
    // SMELL: a mile-long condition with no intermediate variables: you must decipher every fragment
    //        to understand the business rule, and debugging it is a nightmare.
    public static bool Qualifies(Customer c, Cart cart, DateOnly today) =>
        !c.HasUnpaidInvoices
        && ((today.DayNumber - c.SignupDate.DayNumber) / 365 >= 2 && c.OrdersLastYear >= 6
            || cart.Total >= 75m && !cart.Categories.Any(x => x is "Furniture" or "Appliances"));

    // SMELL: parsing with chained indexes and Substring calls, without naming the parts.
    public static (string Country, int Year, int Number) ParseOrderCode(string code) =>
        (code.Substring(0, 2), int.Parse(code.Substring(3, 4)), int.Parse(code.Substring(code.LastIndexOf('-') + 1)));
}
