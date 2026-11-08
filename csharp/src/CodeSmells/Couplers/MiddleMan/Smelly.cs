namespace CodeSmells.Couplers.MiddleMan.Smelly;

public sealed record Reservation(string Id, string Guest, DateOnly Date, int Seats);

public sealed class ReservationBook
{
    private readonly Dictionary<string, Reservation> _items = new();
    public void Add(Reservation r) => _items[r.Id] = r;
    public Reservation? Find(string id) => _items.GetValueOrDefault(id);
    public bool Remove(string id) => _items.Remove(id);
    public IEnumerable<Reservation> On(DateOnly date) => _items.Values.Where(r => r.Date == date);
    public int SeatsOn(DateOnly date) => On(date).Sum(r => r.Seats);
}

// SMELL: Middle Man. Every method of RestaurantReservations just forwards the call to
// ReservationBook. It adds no logic, only a layer that must be maintained every time the
// book gains a new method.
public sealed class RestaurantReservations
{
    private readonly ReservationBook _book = new();

    public void Add(Reservation r) => _book.Add(r);
    public Reservation? Find(string id) => _book.Find(id);
    public bool Cancel(string id) => _book.Remove(id);
    public IEnumerable<Reservation> On(DateOnly date) => _book.On(date);
    public int SeatsOn(DateOnly date) => _book.SeatsOn(date);
}
