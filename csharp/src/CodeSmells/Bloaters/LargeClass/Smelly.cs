namespace CodeSmells.Bloaters.LargeClass.Smelly;

/// <summary>
/// Library manager that "knows everything": members, catalog, loans, fines and notifications.
/// </summary>
// SMELL: Large Class / God Class. A single class accumulates fields and methods of five
// different responsibilities. Any change (a new fine rule, a new notification channel) forces
// you to touch it, and you cannot test one part without dragging the rest along.
public class LibraryManager
{
    private readonly Dictionary<string, string> _members = new();      // id -> name
    private readonly Dictionary<string, string> _books = new();        // isbn -> title
    private readonly Dictionary<string, (string MemberId, DateOnly Due)> _loans = new();
    private readonly Dictionary<string, decimal> _fines = new();
    private readonly List<string> _sentNotifications = new();

    public IReadOnlyList<string> SentNotifications => _sentNotifications;

    public void AddMember(string id, string name) => _members[id] = name;
    public void AddBook(string isbn, string title) => _books[isbn] = title;

    public void Lend(string isbn, string memberId, DateOnly today)
    {
        if (!_members.ContainsKey(memberId)) throw new InvalidOperationException("Unknown member");
        if (!_books.ContainsKey(isbn)) throw new InvalidOperationException("Unknown book");
        if (_loans.ContainsKey(isbn)) throw new InvalidOperationException("Book already on loan");
        if (FineOf(memberId) > 0) throw new InvalidOperationException("Member has pending fines");
        _loans[isbn] = (memberId, today.AddDays(14));
        // SMELL: notification formatting lives here too.
        _sentNotifications.Add($"{_members[memberId]}: you borrowed '{_books[isbn]}'");
    }

    public void Return(string isbn, DateOnly today)
    {
        var (memberId, due) = _loans[isbn];
        _loans.Remove(isbn);
        var daysLate = today.DayNumber - due.DayNumber;
        if (daysLate > 0)
        {
            // SMELL: the fine policy is buried inside the loan logic.
            _fines[memberId] = FineOf(memberId) + daysLate * 0.25m;
            _sentNotifications.Add($"{_members[memberId]}: fine of {daysLate * 0.25m:0.00}");
        }
    }

    public decimal FineOf(string memberId) => _fines.GetValueOrDefault(memberId);

    public void PayFine(string memberId) => _fines.Remove(memberId);
}
