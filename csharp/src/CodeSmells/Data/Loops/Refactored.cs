namespace CodeSmells.Data.Loops.Refactored;

public sealed record Sale(string Region, string Seller, decimal Amount, bool Refunded);

public static class SalesStats
{
    // REFACTOR: Replace Loop with Pipeline. Each step of the LINQ pipeline names the intent:
    // filter, group, sum, sort and take the first N.
    public static List<string> TopSellers(IEnumerable<Sale> sales, string region, int top) =>
        sales.Where(s => s.Region == region && !s.Refunded)
             .GroupBy(s => s.Seller)
             .Select(g => (Seller: g.Key, Total: g.Sum(s => s.Amount)))
             .OrderByDescending(x => x.Total)
             .ThenBy(x => x.Seller, StringComparer.Ordinal)
             .Take(top)
             .Select(x => x.Seller)
             .ToList();
}
