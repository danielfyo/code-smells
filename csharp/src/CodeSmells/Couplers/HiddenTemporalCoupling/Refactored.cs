namespace CodeSmells.Couplers.HiddenTemporalCoupling.Refactored;

public sealed record MerchantConfig(string MerchantId, string Currency);

// REFACTOR: Make temporal coupling explicit. Configuration is mandatory in the constructor and
// opening a session returns the object that can charge: calling in the wrong order is
// impossible because Charge only exists on an open session.
public sealed class PaymentGateway(MerchantConfig config)
{
    public PaymentSession OpenSession() => new(config);
}

public sealed class PaymentSession
{
    private readonly MerchantConfig _config;
    private readonly List<string> _log;

    internal PaymentSession(MerchantConfig config)
    {
        _config = config;
        _log = [$"session:{config.MerchantId}"];
    }

    public IReadOnlyList<string> Log => _log;

    public string Charge(string card, decimal amount)
    {
        var receipt = $"{_config.MerchantId}|{card[^4..]}|{amount} {_config.Currency}";
        _log.Add(receipt);
        return receipt;
    }
}
