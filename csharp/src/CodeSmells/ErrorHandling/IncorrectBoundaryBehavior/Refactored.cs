namespace CodeSmells.ErrorHandling.IncorrectBoundaryBehavior.Refactored;

public sealed record Product(string Name, decimal Rating);

// REFACTOR: Encapsulate Boundary Conditions. Edges (first/last page, empty collection,
// out-of-range arguments) are handled explicitly and in a single place.
public static class CatalogPaging
{
    public static List<Product> Page(IReadOnlyList<Product> items, int pageNumber, int pageSize)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(pageNumber, 1);
        ArgumentOutOfRangeException.ThrowIfLessThan(pageSize, 1);
        var offset = (pageNumber - 1) * pageSize; // 1-based pages
        return items.Skip(offset).Take(pageSize).ToList();
    }

    public static int TotalPages(int itemCount, int pageSize)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(pageSize, 1);
        return (itemCount + pageSize - 1) / pageSize; // round up
    }

    /// <summary>Average rating; an empty catalog has no average (null).</summary>
    public static decimal? AverageRating(IReadOnlyCollection<Product> items) =>
        items.Count == 0 ? null : items.Average(p => p.Rating);
}
