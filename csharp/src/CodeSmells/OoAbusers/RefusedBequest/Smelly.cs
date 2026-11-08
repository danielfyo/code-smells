namespace CodeSmells.OoAbusers.RefusedBequest.Smelly;

public class BankAccount
{
    public decimal Balance { get; protected set; }

    public virtual void Deposit(decimal amount) => Balance += amount;

    public virtual void Withdraw(decimal amount)
    {
        if (amount > Balance) throw new InvalidOperationException("Insufficient funds");
        Balance -= amount;
    }
}

public class CheckingAccount : BankAccount { }

// SMELL: Refused Bequest. A fixed-term deposit inherits Withdraw but "refuses" it by throwing
// NotSupportedException. Any code written against BankAccount that calls Withdraw breaks
// when it receives this subclass: it violates the Liskov substitution principle.
public class FixedTermDeposit : BankAccount
{
    public DateOnly MaturityDate { get; }

    public FixedTermDeposit(decimal initial, DateOnly maturity)
    {
        Balance = initial;
        MaturityDate = maturity;
    }

    public override void Withdraw(decimal amount) =>
        throw new NotSupportedException("Cannot withdraw from a fixed-term deposit");

    public decimal Close(DateOnly today)
    {
        if (today < MaturityDate) throw new InvalidOperationException("Not matured yet");
        var amount = Balance;
        Balance = 0;
        return amount;
    }
}

public static class MonthlyFees
{
    /// <summary>Charges a fee to every account.</summary>
    public static void Charge(IEnumerable<BankAccount> accounts, decimal fee)
    {
        foreach (var account in accounts)
            account.Withdraw(fee); // SMELL: blows up with FixedTermDeposit.
    }
}
