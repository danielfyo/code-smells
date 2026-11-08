namespace CodeSmells.Functions.CommandQueryViolation.Smelly;

public sealed class GiftCardRegistry
{
    private readonly Dictionary<string, decimal> _balances = new();

    public void Issue(string code, decimal amount) => _balances[code] = amount;

    // SMELL: Command-Query Separation Violation. Redeem returns the amount (query) and at the same
    // time drains the card (command). Code that only wants to "see how much the card covers"
    // consumes it by accident, and the second call returns 0.
    public decimal Redeem(string code, decimal orderTotal)
    {
        if (!_balances.TryGetValue(code, out var balance)) return 0m;
        var used = Math.Min(balance, orderTotal);
        _balances[code] = balance - used;
        return used;
    }

    public decimal BalanceOf(string code) => _balances.GetValueOrDefault(code);
}
