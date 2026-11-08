namespace CodeSmells.Couplers.MiddleMan.Refactored;

public sealed record Reservation(string Id, string Guest, DateOnly Date, int Seats);

// REFACTOR: Remove Middle Man. Clients use ReservationBook directly; the class that only
// delegated disappears. (If real logic shows up later, e.g. capacity limits, it goes here.)
public sealed class ReservationBook
{
    private readonly Dictionary<string, Reservation> _items = new();
    public void Add(Reservation r) => _items[r.Id] = r;
    public Reservation? Find(string id) => _items.GetValueOrDefault(id);
    public bool Cancel(string id) => _items.Remove(id);
    public IEnumerable<Reservation> On(DateOnly date) => _items.Values.Where(r => r.Date == date);
    public int SeatsOn(DateOnly date) => On(date).Sum(r => r.Seats);
}
