namespace CodeSmells.Tests.FragileTest;

// Production code. The "Fragile Test" smell lives in tests/CodeSmells.Tests/Tests/FragileTest/.
public class PriceCalculator
{
    private readonly List<string> _appliedRules = new();

    public decimal FinalPrice(decimal basePrice, int quantity, bool isMember)
    {
        _appliedRules.Clear();
        var price = basePrice * quantity;
        price = ApplyVolumeDiscount(price, quantity);
        if (isMember)
        {
            _appliedRules.Add("member");
            price -= 5m;
        }
        return Math.Max(price, 0m);
    }

    private decimal ApplyVolumeDiscount(decimal price, int quantity)
    {
        if (quantity < 10)
        {
            return price;
        }

        _appliedRules.Add("volume");
        return price * 0.9m;
    }
}
