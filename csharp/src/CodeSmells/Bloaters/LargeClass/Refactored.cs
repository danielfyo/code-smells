namespace CodeSmells.Bloaters.LargeClass.Refactored;

// REFACTOR: Extract Class. Each responsibility moves to its own small, cohesive class;
// the LibraryService facade only coordinates.

public sealed class MemberRegistry
{
    private readonly Dictionary<string, string> _names = new();
    public void Add(string id, string name) => _names[id] = name;
    public bool Exists(string id) => _names.ContainsKey(id);
    public string NameOf(string id) => _names[id];
}

public sealed class Catalog
{
    private readonly Dictionary<string, string> _titles = new();
    public void Add(string isbn, string title) => _titles[isbn] = title;
    public bool Exists(string isbn) => _titles.ContainsKey(isbn);
    public string TitleOf(string isbn) => _titles[isbn];
}

/// <summary>Isolated fine policy: it can be changed or tested without touching loans.</summary>
public sealed class FinePolicy(decimal perDay = 0.25m)
{
    public decimal For(int daysLate) => daysLate > 0 ? daysLate * perDay : 0m;
}

public sealed class FineLedger
{
    private readonly Dictionary<string, decimal> _fines = new();
    public decimal Of(string memberId) => _fines.GetValueOrDefault(memberId);
    public void Add(string memberId, decimal amount) => _fines[memberId] = Of(memberId) + amount;
    public void Clear(string memberId) => _fines.Remove(memberId);
}

public sealed class Notifier
{
    private readonly List<string> _sent = new();
    public IReadOnlyList<string> Sent => _sent;
    public void Send(string recipient, string message) => _sent.Add($"{recipient}: {message}");
}

public sealed record Loan(string MemberId, DateOnly Due);

public sealed class LibraryService(MemberRegistry members, Catalog catalog, FineLedger fines, FinePolicy policy, Notifier notifier)
{
    private readonly Dictionary<string, Loan> _loans = new();

    public void Lend(string isbn, string memberId, DateOnly today)
    {
        if (!members.Exists(memberId)) throw new InvalidOperationException("Unknown member");
        if (!catalog.Exists(isbn)) throw new InvalidOperationException("Unknown book");
        if (_loans.ContainsKey(isbn)) throw new InvalidOperationException("Book already on loan");
        if (fines.Of(memberId) > 0) throw new InvalidOperationException("Member has pending fines");
        _loans[isbn] = new Loan(memberId, today.AddDays(14));
        notifier.Send(members.NameOf(memberId), $"you borrowed '{catalog.TitleOf(isbn)}'");
    }

    public void Return(string isbn, DateOnly today)
    {
        var loan = _loans[isbn];
        _loans.Remove(isbn);
        var fine = policy.For(today.DayNumber - loan.Due.DayNumber);
        if (fine > 0)
        {
            fines.Add(loan.MemberId, fine);
            notifier.Send(members.NameOf(loan.MemberId), $"fine of {fine:0.00}");
        }
    }
}
