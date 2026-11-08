namespace CodeSmells.Names.FallaciousMethodName.Refactored;

public class Subscriber(string email)
{
    public string Email { get; private set; } = email;
    public List<decimal> Payments { get; } = new();

    // REFACTOR: Separate Query from Modifier: normalization is a command with its own name...
    public void NormalizeEmail() => Email = Email.Trim().ToLowerInvariant();

    // REFACTOR: ...and the question no longer has side effects.
    public bool HasValidEmail() => Email.Contains('@') && Email.Contains('.');

    // REFACTOR: Rename Method: the name says what it really returns.
    public decimal GetAveragePayment() => Payments.Count == 0 ? 0 : Payments.Average();
}
