namespace CodeSmells.Names.FallaciousMethodName.Smelly;

public class Subscriber(string email)
{
    public string Email { get; private set; } = email;
    public List<decimal> Payments { get; } = new();

    // SMELL: "IsValidEmail" promises a question (no side effects), but it also MODIFIES the email.
    public bool IsValidEmail()
    {
        Email = Email.Trim().ToLowerInvariant();
        return Email.Contains('@') && Email.Contains('.');
    }

    // SMELL: "GetTotalPaid" returns... the average payment. The name lies about the result.
    public decimal GetTotalPaid() => Payments.Count == 0 ? 0 : Payments.Average();
}
