namespace CodeSmells.ErrorHandling.IncorrectBoundaryBehavior.Smelly;

public sealed record Product(string Name, decimal Rating);

public static class CatalogPaging
{
    // SMELL: Incorrect Behavior at the Boundaries. Nobody thought about the edges:
    //  - pages are 1-based but the offset multiplies by pageNumber -> page 1 skips the first page;
    //  - TotalPages truncates: 21 products in pages of 10 are "2" pages and the last one is lost;
    //  - the average of an empty catalog divides by zero.
    public static List<Product> Page(IReadOnlyList<Product> items, int pageNumber, int pageSize) =>
        items.Skip(pageNumber * pageSize).Take(pageSize).ToList();

    public static int TotalPages(int itemCount, int pageSize) => itemCount / pageSize;

    public static decimal AverageRating(IReadOnlyList<Product> items)
    {
        decimal sum = 0;
        for (int i = 0; i < items.Count; i++) sum += items[i].Rating;
        return sum / items.Count;
    }
}
