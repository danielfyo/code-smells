using System.Globalization;

namespace CodeSmells.Tests.ConditionalTestLogic;

// Production code. The "Conditional Test Logic" smell lives in tests/CodeSmells.Tests/Tests/ConditionalTestLogic/.
public sealed record Order(string CustomerEmail, int Quantity, string Country);

public static class OrderValidator
{
    private static readonly HashSet<string> ShippingCountries = new() { "ES", "PT", "FR" };

    public static IReadOnlyList<string> Validate(Order order)
    {
        var errors = new List<string>();
        if (!order.CustomerEmail.Contains('@'))
        {
            errors.Add("email");
        }

        if (order.Quantity is < 1 or > 100)
        {
            errors.Add("quantity");
        }

        if (!ShippingCountries.Contains(order.Country))
        {
            errors.Add("country");
        }

        return errors;
    }

    public static Order Parse(string csv)
    {
        var parts = csv.Split(',');
        if (parts.Length != 3)
        {
            throw new FormatException("Expected email,quantity,country");
        }

        return new Order(parts[0], int.Parse(parts[1], CultureInfo.InvariantCulture), parts[2]);
    }
}
