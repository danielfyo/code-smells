namespace CodeSmells.Comments.InappropriateInformation.Smelly;

//Author Daniel Yepes
//Create Date 01-01-2001
// SMELL: author and creation date are metadata already stored by version control (git blame / git log).
//        Here they go stale, nobody updates them and they tell the reader of the code nothing.
//
// Change history:
//   15-03-2004  JLopez   Added per-series prefix (ticket JIRA-1234)
//   02-11-2009  MGarcia  Zero padding to 6 digits (ticket JIRA-5678)
//   20-06-2015  DYepes   2-digit year no longer used
// SMELL: a changelog inside the file duplicates (badly) the commit history and the issue tracker.
public class InvoiceNumberGenerator
{
    private int _lastNumber;

    // Reviewed in Tuesday's meeting with Accounting, see minutes 2015-06
    // SMELL: references to meetings and minutes belong in another tool, not in the code.
    public string Next(string series, int year)
    {
        _lastNumber++;
        // Modified by MGarcia (JIRA-5678): used to be _lastNumber.ToString()
        // SMELL: who changed a line and why is commit information, not code.
        return $"{series}-{year}-{_lastNumber:D6}";
    }
}
