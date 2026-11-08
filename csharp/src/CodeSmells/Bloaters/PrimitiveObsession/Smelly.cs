namespace CodeSmells.Bloaters.PrimitiveObsession.Smelly;

public sealed class Invoice
{
    // SMELL: Primitive Obsession. The email is any string, money is a bare decimal and the
    // currency another string. Nothing prevents adding euros to dollars or storing "hello" as an email.
    public string CustomerEmail { get; set; } = "";
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "EUR";
}

public static class InvoiceOperations
{
    // SMELL: email validation is copied wherever it is needed (and every copy drifts).
    public static bool IsValidEmail(string email) =>
        email.Contains('@') && email.IndexOf('@') > 0 && email.IndexOf('@') < email.Length - 1;

    public static Invoice Create(string email, decimal amount, string currency)
    {
        if (!IsValidEmail(email)) throw new ArgumentException("Invalid email");
        if (amount < 0) throw new ArgumentException("Negative amount");
        return new Invoice { CustomerEmail = email.Trim().ToLowerInvariant(), Amount = amount, Currency = currency };
    }

    // SMELL: the caller has to remember to check the currency; if not, currencies get mixed.
    public static decimal SumAmounts(IEnumerable<Invoice> invoices) => invoices.Sum(i => i.Amount);
}
