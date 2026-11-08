namespace CodeSmells.Couplers.HiddenTemporalCoupling.Smelly;

// SMELL: Hidden Temporal Coupling. You must call Configure(), then OpenSession() and only
// then Charge(). Nothing in the API says so: called in another order it fails at runtime
// with a NullReferenceException or, worse, charges in the default currency.
public sealed class PaymentGateway
{
    private string? _merchantId;
    private string _currency = "USD";
    private List<string>? _session;

    public void Configure(string merchantId, string currency)
    {
        _merchantId = merchantId;
        _currency = currency;
    }

    public void OpenSession() => _session = new List<string> { $"session:{_merchantId}" };

    public string Charge(string card, decimal amount)
    {
        var receipt = $"{_merchantId}|{card[^4..]}|{amount} {_currency}";
        _session!.Add(receipt);
        return receipt;
    }
}
