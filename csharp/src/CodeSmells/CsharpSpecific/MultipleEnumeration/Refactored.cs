namespace CodeSmells.CsharpSpecific.MultipleEnumeration.Refactored;

public sealed record SalesStats(int Count, decimal Total, decimal Max);

public static class SalesReport
{
    // REFACTOR: the sequence is materialized ONCE (or the signature asks for an already materialized
    //           IReadOnlyCollection<T>) and all the work is done on the list.
    public static SalesStats Summarize(IEnumerable<decimal> amounts)
    {
        var list = amounts as IReadOnlyList<decimal> ?? amounts.ToList();
        if (list.Count == 0)
        {
            return new SalesStats(0, 0m, 0m);
        }

        return new SalesStats(list.Count, list.Sum(), list.Max());
    }
}
