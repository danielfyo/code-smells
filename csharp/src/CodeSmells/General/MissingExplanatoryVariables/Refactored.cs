using System.Globalization;

namespace CodeSmells.General.MissingExplanatoryVariables.Refactored;

public sealed record Customer(DateOnly SignupDate, int OrdersLastYear, bool HasUnpaidInvoices);
public sealed record Cart(decimal Total, IReadOnlyList<string> Categories);

public static class FreeShippingPolicy
{
    private static readonly string[] BulkyCategories = { "Furniture", "Appliances" };

    // REFACTOR: Introduce Explaining Variable: each part of the condition gets a business name.
    public static bool Qualifies(Customer customer, Cart cart, DateOnly today)
    {
        var yearsAsCustomer = (today.DayNumber - customer.SignupDate.DayNumber) / 365;
        var isLoyalCustomer = yearsAsCustomer >= 2 && customer.OrdersLastYear >= 6;
        var containsBulkyItems = cart.Categories.Any(BulkyCategories.Contains);
        var isLargeLightOrder = cart.Total >= 75m && !containsBulkyItems;

        return !customer.HasUnpaidInvoices && (isLoyalCustomer || isLargeLightOrder);
    }

    // REFACTOR: the parts of the code ("ES-2024-000123") are named as they are split.
    public static (string Country, int Year, int Number) ParseOrderCode(string code)
    {
        var parts = code.Split('-');
        var country = parts[0];
        var year = int.Parse(parts[1], CultureInfo.InvariantCulture);
        var sequenceNumber = int.Parse(parts[^1], CultureInfo.InvariantCulture);
        return (country, year, sequenceNumber);
    }
}
