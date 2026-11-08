namespace CodeSmells.General.TooMuchInformation.Refactored;

// REFACTOR: Encapsulate Field + Hide Method: the public interface shrinks to what clients need
//           (deposit, withdraw, query). The rest becomes private and can change freely.
public class BankAccount(decimal overdraftLimit = 0m)
{
    private readonly List<decimal> _movements = new();

    public decimal Balance { get; private set; }
    public IReadOnlyList<decimal> Movements => _movements;

    public void Deposit(decimal amount)
    {
        ValidatePositive(amount);
        Apply(amount);
    }

    public void Withdraw(decimal amount)
    {
        ValidatePositive(amount);
        if (Balance + overdraftLimit < amount)
        {
            throw new InvalidOperationException("Insufficient funds");
        }

        Apply(-amount);
    }

    private static void ValidatePositive(decimal amount) =>
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount);

    private void Apply(decimal signedAmount)
    {
        _movements.Add(signedAmount);
        Balance += signedAmount;
    }
}
