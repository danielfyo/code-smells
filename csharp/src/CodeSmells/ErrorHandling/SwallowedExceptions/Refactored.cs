namespace CodeSmells.ErrorHandling.SwallowedExceptions.Refactored;

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

public sealed class TransferFailedException(string message, Exception inner) : Exception(message, inner);

public sealed class TransferService
{
    // REFACTOR: Fail fast + compensate and rethrow. Only what we know how to handle is caught:
    // the debit is undone to keep the system consistent and the error propagates with context.
    public void Transfer(Account from, Account to, decimal amount)
    {
        from.Debit(amount);
        try
        {
            to.Credit(amount);
        }
        catch (InvalidOperationException ex)
        {
            from.Credit(amount); // compensation
            throw new TransferFailedException($"Could not transfer {amount} from {from.Id} to {to.Id}", ex);
        }
    }
}
