namespace CodeSmells.Names.ShortNamesLongScopes.Refactored;

// REFACTOR: Rename: the length of a name grows with its scope. Fields and parameters get full
//           names; only one-line lambdas keep short names, because their scope is tiny.
public class RoomBookingService(int maxBookingsPerDay)
{
    private readonly Dictionary<string, int> _capacityByRoom = new();
    private readonly List<Booking> _bookings = new();

    private sealed record Booking(string Room, DateOnly Date, int People);

    public void AddRoom(string roomName, int capacity) => _capacityByRoom[roomName] = capacity;

    public bool Book(string roomName, DateOnly date, int people)
    {
        var roomFits = _capacityByRoom.TryGetValue(roomName, out var capacity) && people <= capacity;
        if (!roomFits || BookingsOn(date) >= maxBookingsPerDay || IsBooked(roomName, date))
        {
            return false;
        }

        _bookings.Add(new Booking(roomName, date, people));
        return true;
    }

    public int BookingsOn(DateOnly date) => _bookings.Count(b => b.Date == date);

    private bool IsBooked(string roomName, DateOnly date) =>
        _bookings.Any(b => b.Room == roomName && b.Date == date);
}
