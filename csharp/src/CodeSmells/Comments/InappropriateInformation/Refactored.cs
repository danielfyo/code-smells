namespace CodeSmells.Comments.InappropriateInformation.Refactored;

// REFACTOR: author, dates, changelog and references to tickets/meetings are removed.
//           That information lives in version control (commits, PRs) and in the issue tracker,
//           where it maintains itself and can be queried with git blame / git log.

/// <summary>
/// Generates consecutive invoice numbers with the format <c>SERIES-YEAR-NNNNNN</c>.
/// </summary>
public class InvoiceNumberGenerator
{
    private int _lastNumber;

    // REFACTOR: the only remaining comment explains the "what" of the public API (XML documentation),
    //           which does belong in the code.
    /// <summary>Returns the next invoice number for the given series.</summary>
    public string Next(string series, int year)
    {
        _lastNumber++;
        return $"{series}-{year}-{_lastNumber:D6}";
    }
}
