namespace CodeSmells.Couplers.InsiderTrading.Refactored;

// REFACTOR: Move Function + Hide Delegate (explicit interface). Collaboration goes through a
// public contract: the checkout asks "is it gold?" and reports "they spent X".
public interface ILoyaltyProgram
{
    bool IsGold(string customerId);
    void RecordPurchase(string customerId, decimal amountPaid);
}

public sealed class LoyaltyProgram : ILoyaltyProgram
{
    private const int GoldThreshold = 1000;
    private readonly Dictionary<string, int> _points = new();

    public int PointsOf(string customerId) => _points.GetValueOrDefault(customerId);
    public bool IsGold(string customerId) => PointsOf(customerId) >= GoldThreshold;
    public void RecordPurchase(string customerId, decimal amountPaid) =>
        _points[customerId] = PointsOf(customerId) + (int)amountPaid;
}

public sealed class Checkout(ILoyaltyProgram loyalty)
{
    private const decimal GoldDiscount = 0.95m;

    public decimal Pay(string customerId, decimal amount)
    {
        var toPay = loyalty.IsGold(customerId) ? amount * GoldDiscount : amount;
        loyalty.RecordPurchase(customerId, toPay);
        return toPay;
    }
}
