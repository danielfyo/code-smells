namespace CodeSmells.Couplers.InsiderTrading.Smelly;

// SMELL: Insider Trading. The loyalty and checkout modules swap internal data "through the
// back door": Checkout reads and writes the internal points dictionary and knows the secret
// gold-tier threshold. Nothing in LoyaltyProgram's public interface reflects this.
public sealed class LoyaltyProgram
{
    internal readonly Dictionary<string, int> RawPoints = new();
    internal const int GoldThreshold = 1000;

    public int PointsOf(string customerId) => RawPoints.GetValueOrDefault(customerId);
}

public sealed class Checkout(LoyaltyProgram loyalty)
{
    public decimal Pay(string customerId, decimal amount)
    {
        var points = loyalty.RawPoints.GetValueOrDefault(customerId);
        var isGold = points >= LoyaltyProgram.GoldThreshold; // someone else's internal knowledge
        var toPay = isGold ? amount * 0.95m : amount;
        loyalty.RawPoints[customerId] = points + (int)toPay;  // writes someone else's state
        return toPay;
    }
}
