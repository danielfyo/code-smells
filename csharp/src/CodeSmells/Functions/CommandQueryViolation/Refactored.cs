namespace CodeSmells.Functions.CommandQueryViolation.Refactored;

public sealed class GiftCardRegistry
{
    private readonly Dictionary<string, decimal> _balances = new();

    public void Issue(string code, decimal amount) => _balances[code] = amount;

    // REFACTOR: Separate Query from Modifier. The query changes nothing and can be called as
    // many times as you like...
    public decimal CoverageFor(string code, decimal orderTotal) => Math.Min(BalanceOf(code), orderTotal);

    // ...and the command changes state without returning business information.
    public void Charge(string code, decimal amount)
    {
        if (amount > BalanceOf(code)) throw new InvalidOperationException("Saldo insuficiente");
        _balances[code] = BalanceOf(code) - amount;
    }

    public decimal BalanceOf(string code) => _balances.GetValueOrDefault(code);
}
