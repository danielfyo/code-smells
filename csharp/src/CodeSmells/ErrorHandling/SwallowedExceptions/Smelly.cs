namespace CodeSmells.ErrorHandling.SwallowedExceptions.Smelly;

public sealed class Account(string id, decimal balance, bool isFrozen = false)
{
    public string Id { get; } = id;
    public decimal Balance { get; private set; } = balance;
    public bool IsFrozen { get; } = isFrozen;

    public void Debit(decimal amount)
    {
        if (amount > Balance) throw new InvalidOperationException("Insufficient funds");
        Balance -= amount;
    }

    public void Credit(decimal amount)
    {
        if (IsFrozen) throw new InvalidOperationException($"Account {Id} is frozen");
        Balance += amount;
    }
}

public sealed class TransferService
{
    // SMELL: Swallowed Exceptions / Afraid to Fail. The empty catch "eats" every error.
    // If the credit fails after the debit, the money vanishes: the source was already debited,
    // the target received nothing and the caller believes everything went fine.
    public void Transfer(Account from, Account to, decimal amount)
    {
        try
        {
            from.Debit(amount);
            to.Credit(amount);
        }
        catch (Exception)
        {
            // TODO: log the error some day
        }
    }
}
