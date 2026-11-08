namespace CodeSmells.OoAbusers.RefusedBequest.Refactored;

// REFACTOR: Replace Inheritance with Delegation / Extract Interface (Push Down Method).
// The hierarchy only expresses what all accounts share; the ability to withdraw is an
// interface implemented only by those that really have it.
public interface IAccount
{
    decimal Balance { get; }
    void Deposit(decimal amount);
}

public interface IWithdrawable : IAccount
{
    void Withdraw(decimal amount);
}

public sealed class CheckingAccount : IWithdrawable
{
    public decimal Balance { get; private set; }
    public void Deposit(decimal amount) => Balance += amount;

    public void Withdraw(decimal amount)
    {
        if (amount > Balance)
        {
            throw new InvalidOperationException("Insufficient funds");
        }

        Balance -= amount;
    }
}

public sealed class FixedTermDeposit(decimal initial, DateOnly maturity) : IAccount
{
    public decimal Balance { get; private set; } = initial;
    public DateOnly MaturityDate { get; } = maturity;
    public void Deposit(decimal amount) => Balance += amount;

    public decimal Close(DateOnly today)
    {
        if (today < MaturityDate)
        {
            throw new InvalidOperationException("Not matured yet");
        }

        var amount = Balance;
        Balance = 0;
        return amount;
    }
}

public static class MonthlyFees
{
    // REFACTOR: the parameter type states which accounts accept fees; the compiler prevents
    // passing a fixed-term deposit.
    public static void Charge(IEnumerable<IWithdrawable> accounts, decimal fee)
    {
        foreach (var account in accounts)
        {
            account.Withdraw(fee);
        }
    }
}
