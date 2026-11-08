namespace CodeSmells.General.TooMuchInformation.Smelly;

// SMELL: the class exposes everything: public fields, internal collections and helper methods
//        that only make sense internally. Every public member is a contract others will use
//        and that we will no longer be able to change.
public class BankAccount
{
    public decimal Balance;                       // SMELL: anyone can assign an arbitrary balance.
    public List<decimal> Movements = new();       // SMELL: exposed mutable internal collection.
    public decimal OverdraftLimit = 0m;
    public int MovementCountCache;                // SMELL: caching detail nobody outside needs.

    public void Deposit(decimal amount)
    {
        ValidatePositive(amount);
        ApplyMovement(amount);
    }

    public void Withdraw(decimal amount)
    {
        ValidatePositive(amount);
        if (!HasFundsFor(amount)) throw new InvalidOperationException("Insufficient funds");
        ApplyMovement(-amount);
    }

    // SMELL: internal helpers made public "just in case".
    public void ValidatePositive(decimal amount)
    {
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount));
    }

    public bool HasFundsFor(decimal amount) => Balance + OverdraftLimit >= amount;

    public void ApplyMovement(decimal signedAmount)
    {
        Movements.Add(signedAmount);
        Balance += signedAmount;
        MovementCountCache = Movements.Count;
    }
}
