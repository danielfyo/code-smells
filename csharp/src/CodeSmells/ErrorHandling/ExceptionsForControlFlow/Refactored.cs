using System.Globalization;

namespace CodeSmells.ErrorHandling.ExceptionsForControlFlow.Refactored;

public sealed class StockImporter(Dictionary<string, int> stock)
{
    // REFACTOR: Replace Exception with Test (Tester-Doer / Try pattern). Expected cases are
    // checked with explicit conditions (TryParse, TryGetValue); exceptions are reserved for the
    // truly exceptional.
    public (int Applied, int Rejected) Import(IEnumerable<string> lines)
    {
        int applied = 0, rejected = 0;
        foreach (var line in lines)
        {
            if (TryApply(line)) applied++;
            else rejected++;
        }
        return (applied, rejected);
    }

    private bool TryApply(string line)
    {
        var parts = line.Split(',');
        if (parts.Length != 2) return false;
        if (!int.TryParse(parts[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out var delta)) return false;
        if (!stock.TryGetValue(parts[0], out var current)) return false;
        stock[parts[0]] = current + delta;
        return true;
    }
}
