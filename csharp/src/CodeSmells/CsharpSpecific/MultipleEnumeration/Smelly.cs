namespace CodeSmells.CsharpSpecific.MultipleEnumeration.Smelly;

public sealed record SalesStats(int Count, decimal Total, decimal Max);

public static class SalesReport
{
    // SMELL: the IEnumerable may be a deferred query (LINQ, EF, a "yield return" that reads a
    //        file or calls an API). Any + Count + Sum + Max enumerate it FOUR times:
    //        four queries, and inconsistent results if the data changes in between.
    public static SalesStats Summarize(IEnumerable<decimal> amounts)
    {
        if (!amounts.Any())
        {
            return new SalesStats(0, 0m, 0m);
        }

        return new SalesStats(amounts.Count(), amounts.Sum(), amounts.Max());
    }
}
