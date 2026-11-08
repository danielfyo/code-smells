namespace CodeSmells.Bloaters.PrimitiveObsession.Refactored;

// REFACTOR: Replace Primitive with Object (Value Object). Each domain concept has its own type,
// which validates itself on construction and encapsulates its rules.
public sealed record Email
{
    public string Value { get; }

    public Email(string raw)
    {
        var value = raw.Trim().ToLowerInvariant();
        var at = value.IndexOf('@');
        if (at <= 0 || at == value.Length - 1) throw new ArgumentException("Invalid email");
        Value = value;
    }

    public override string ToString() => Value;
}

public sealed record Currency(string Code)
{
    public static readonly Currency Eur = new("EUR");
    public static readonly Currency Usd = new("USD");
}

public readonly record struct Money
{
    public decimal Amount { get; }
    public Currency Currency { get; }

    public Money(decimal amount, Currency currency)
    {
        if (amount < 0) throw new ArgumentException("Negative amount");
        (Amount, Currency) = (amount, currency);
    }

    // REFACTOR: the rule "different currencies cannot be added" lives in the type, not in every caller.
    public static Money operator +(Money a, Money b) =>
        a.Currency == b.Currency
            ? new Money(a.Amount + b.Amount, a.Currency)
            : throw new InvalidOperationException($"Cannot add {a.Currency.Code} to {b.Currency.Code}");

    public static Money Zero(Currency currency) => new(0, currency);
}

public sealed record Invoice(Email CustomerEmail, Money Total);

public static class InvoiceOperations
{
    public static Money SumAmounts(IEnumerable<Invoice> invoices, Currency currency) =>
        invoices.Aggregate(Money.Zero(currency), (acc, i) => acc + i.Total);
}
