namespace CodeSmells.Dispensables.DataClass.Smelly;

// SMELL: Data Class. Only properties with public get/set; it does not protect its invariants.
// All the logic that manipulates it lives elsewhere, in SubscriptionService, which spends its
// time poking at its data (and anyone can set Status = "cancelled" or a negative price).
public sealed class Subscription
{
    public string CustomerId { get; set; } = "";
    public string Plan { get; set; } = "basic";
    public decimal MonthlyPrice { get; set; }
    public DateOnly RenewsOn { get; set; }
    public string Status { get; set; } = "active";
}

public sealed class SubscriptionService
{
    public void Renew(Subscription s)
    {
        if (s.Status != "active") throw new InvalidOperationException("Subscription is not active");
        s.RenewsOn = s.RenewsOn.AddMonths(1);
    }

    public void Upgrade(Subscription s)
    {
        if (s.Status != "active") throw new InvalidOperationException("Subscription is not active");
        if (s.Plan == "premium") return;
        s.Plan = "premium";
        s.MonthlyPrice += 5m;
    }

    public void Cancel(Subscription s) => s.Status = "cancelled";
}
