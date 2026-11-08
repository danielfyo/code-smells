namespace CodeSmells.Dispensables.DataClass.Refactored;

public enum Plan { Basic, Premium }
public enum SubscriptionStatus { Active, Cancelled }

// REFACTOR: Move Method + Encapsulate Field (Remove Setting Method). Behavior moves next to the
// data it uses; the setters disappear and the object guarantees its own rules.
public sealed class Subscription(string customerId, decimal monthlyPrice, DateOnly renewsOn)
{
    private const decimal PremiumSurcharge = 5m;

    public string CustomerId { get; } = customerId;
    public Plan Plan { get; private set; } = Plan.Basic;
    public decimal MonthlyPrice { get; private set; } = monthlyPrice;
    public DateOnly RenewsOn { get; private set; } = renewsOn;
    public SubscriptionStatus Status { get; private set; } = SubscriptionStatus.Active;

    public void Renew()
    {
        EnsureActive();
        RenewsOn = RenewsOn.AddMonths(1);
    }

    public void Upgrade()
    {
        EnsureActive();
        if (Plan == Plan.Premium) return;
        Plan = Plan.Premium;
        MonthlyPrice += PremiumSurcharge;
    }

    public void Cancel() => Status = SubscriptionStatus.Cancelled;

    private void EnsureActive()
    {
        if (Status != SubscriptionStatus.Active) throw new InvalidOperationException("Subscription is not active");
    }
}
