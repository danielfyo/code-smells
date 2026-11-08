namespace CodeSmells.General.HiddenLogicalDependency.Refactored;

public class PageFormatter
{
    // REFACTOR: the formatter owns the value and PUBLISHES it; it also validates its precondition.
    public int MaxLinesPerPage => 3;

    public string FormatPage(int pageNumber, IReadOnlyList<string> lines)
    {
        if (lines.Count > MaxLinesPerPage)
        {
            throw new ArgumentException($"A page holds at most {MaxLinesPerPage} lines", nameof(lines));
        }
        return $"--- Page {pageNumber} ---\n{string.Join("\n", lines)}\n--- {lines.Count}/{MaxLinesPerPage} ---";
    }
}

public class SalesReporter(PageFormatter formatter)
{
    // REFACTOR: Make Logical Dependency Physical: the reporter ASKS for the size instead of assuming it.
    public IReadOnlyList<string> Report(IEnumerable<string> sales) =>
        sales.Chunk(formatter.MaxLinesPerPage)
             .Select((page, index) => formatter.FormatPage(index + 1, page))
             .ToList();
}
