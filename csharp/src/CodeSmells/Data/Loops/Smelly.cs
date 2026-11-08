namespace CodeSmells.Data.Loops.Smelly;

public sealed record Sale(string Region, string Seller, decimal Amount, bool Refunded);

public static class SalesStats
{
    // SMELL: Loops. Manual loops with dictionaries, accumulators and hand-written sorting. The
    // intent ("top N sellers by net revenue in a region") is buried under low-level
    // mechanics.
    public static List<string> TopSellers(List<Sale> sales, string region, int top)
    {
        var totals = new Dictionary<string, decimal>();
        foreach (var sale in sales)
        {
            if (sale.Region != region) continue;
            if (sale.Refunded) continue;
            if (!totals.ContainsKey(sale.Seller)) totals[sale.Seller] = 0;
            totals[sale.Seller] += sale.Amount;
        }

        var pairs = new List<KeyValuePair<string, decimal>>(totals);
        pairs.Sort((a, b) =>
        {
            var byAmount = b.Value.CompareTo(a.Value);
            return byAmount != 0 ? byAmount : string.CompareOrdinal(a.Key, b.Key);
        });

        var result = new List<string>();
        for (int i = 0; i < pairs.Count && i < top; i++)
            result.Add(pairs[i].Key);
        return result;
    }
}
