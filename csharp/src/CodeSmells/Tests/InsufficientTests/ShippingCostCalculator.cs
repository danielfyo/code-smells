namespace CodeSmells.Tests.InsufficientTests;

// Production code. The "Insufficient Tests" smell lives in the test project:
//   tests/CodeSmells.Tests/Tests/InsufficientTests/SmellyTests.cs     -> happy path only
//   tests/CodeSmells.Tests/Tests/InsufficientTests/RefactoredTests.cs -> relevant cases and errors
public static class ShippingCostCalculator
{
    public const decimal FreeShippingFrom = 60m;

    private static readonly Dictionary<string, decimal> BaseCostByZone = new()
    {
        ["peninsula"] = 4.95m,
        ["islands"] = 12.50m,
        ["international"] = 25m,
    };

    public static decimal Calculate(decimal weightKg, decimal orderTotal, string zone)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(weightKg);
        if (!BaseCostByZone.TryGetValue(zone, out var baseCost))
        {
            throw new ArgumentException($"Unknown zone '{zone}'", nameof(zone));
        }

        if (zone == "peninsula" && orderTotal >= FreeShippingFrom)
        {
            return 0m;
        }

        var extraKilos = Math.Max(0, Math.Ceiling(weightKg) - 2);
        return baseCost + extraKilos * 1.10m;
    }
}
