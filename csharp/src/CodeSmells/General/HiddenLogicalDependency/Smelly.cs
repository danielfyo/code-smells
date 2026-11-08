namespace CodeSmells.General.HiddenLogicalDependency.Smelly;

public class PageFormatter
{
    // SMELL: the formatter ASSUMES each page has at most 3 lines (header and footer are designed
    //        for that size), but it neither says so nor checks it.
    public string FormatPage(int pageNumber, IReadOnlyList<string> lines) =>
        $"--- Page {pageNumber} ---\n{string.Join("\n", lines)}\n--- {lines.Count}/3 ---";
}

public class SalesReporter(PageFormatter formatter)
{
    // SMELL: the page size is duplicated here. It is a LOGICAL dependency on PageFormatter:
    //        if someone changes one of the two "3"s, the report breaks without any warning.
    private const int PageSize = 3;

    public IReadOnlyList<string> Report(IEnumerable<string> sales) =>
        sales.Chunk(PageSize)
             .Select((page, index) => formatter.FormatPage(index + 1, page))
             .ToList();
}
